import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  // The editor embeds the shop on a different site. Lax cookies are not sent
  // on its server-function requests, so the password succeeds but /admin
  // immediately looks signed out again. HTTPS + partitioning keeps this safe.
  const embedded = process.env["NODE_ENV"] === "production";
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "ad-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: embedded,
      sameSite: embedded ? "none" as const : "lax" as const,
      partitioned: embedded,
      path: "/",
    },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Not signed in");
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: session.data.admin === true, configured: !!process.env["ADMIN_PASSWORD"] };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => ({ password: String(data.password ?? "") }))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const, reason: "not_configured" as const };
    if (!data.password || !matches(data.password, expected)) {
      return { ok: false as const, reason: "wrong" as const };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export type ProductInput = {
  slug: string;
  name_en: string;
  name_ur: string;
  category: string;
  price: number;
  old_price: number | null;
  pack_en: string;
  pack_ur: string;
  image: string;
  short_en: string;
  short_ur: string;
  description_en: string;
  description_ur: string;
  benefits: { en: string; ur: string }[];
  ingredients: { en: string; ur: string }[];
  dosage_en: string;
  dosage_ur: string;
};

function clean(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanPairs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 20)
    .map((x) => ({ en: clean((x as { en?: string })?.en, 200), ur: clean((x as { ur?: string })?.ur, 200) }))
    .filter((x) => x.en || x.ur);
}

const productSchema = z.object({
  slug: z.string().max(80),
  name_en: z.string().max(120),
  name_ur: z.string().max(120),
  category: z.enum(["herbal-teas", "oils", "immunity", "syrups", "wellness"]),
  price: z.number().finite().nonnegative(),
  old_price: z.number().finite().nonnegative().nullable(),
  pack_en: z.string().max(60),
  pack_ur: z.string().max(60),
  image: z.string().max(1000),
  short_en: z.string().max(200),
  short_ur: z.string().max(200),
  description_en: z.string().max(4000),
  description_ur: z.string().max(4000),
  benefits: z.array(z.object({ en: z.string().max(200), ur: z.string().max(200) })).max(20),
  ingredients: z.array(z.object({ en: z.string().max(200), ur: z.string().max(200) })).max(20),
  dosage_en: z.string().max(1000),
  dosage_ur: z.string().max(1000),
});

const productInputSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  product: productSchema,
});

const settingsInputSchema = z.object({
  whatsapp: z.string().regex(/^\+?\d{10,15}$/),
  phone: z.string().max(60),
  email: z.string().email().max(255),
  addressEn: z.string().max(500),
  addressUr: z.string().max(500),
  mapQuery: z.string().max(500),
  heroTitleEn: z.string().max(500),
  heroTitleUr: z.string().max(500),
  heroSubtitleEn: z.string().max(500),
  heroSubtitleUr: z.string().max(500),
  announcementEn: z.string().max(500),
  announcementUr: z.string().max(500),
});

function validateProduct(data: ProductInput): ProductInput {
  const slug =
    clean(data.slug, 80)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `product-${Date.now()}`;
  const price = Number(data.price);
  const old = data.old_price === null || data.old_price === undefined || data.old_price === ("" as never)
    ? null
    : Number(data.old_price);
  if (!Number.isFinite(price) || price < 0) throw new Error("Price is not valid");
  const name_en = clean(data.name_en, 120);
  const name_ur = clean(data.name_ur, 120);
  if (!name_en && !name_ur) throw new Error("Product name is required");
  return {
    slug,
    name_en: name_en || name_ur,
    name_ur: name_ur || name_en,
    category: clean(data.category, 60) || "wellness",
    price,
    old_price: old !== null && Number.isFinite(old) && old > 0 ? old : null,
    pack_en: clean(data.pack_en, 60),
    pack_ur: clean(data.pack_ur, 60),
    image: clean(data.image, 1000) || "tea",
    short_en: clean(data.short_en, 200),
    short_ur: clean(data.short_ur, 200),
    description_en: clean(data.description_en, 4000),
    description_ur: clean(data.description_ur, 4000),
    benefits: cleanPairs(data.benefits),
    ingredients: cleanPairs(data.ingredients),
    dosage_en: clean(data.dosage_en, 1000),
    dosage_ur: clean(data.dosage_ur, 1000),
  };
}

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { id?: string | null; product: ProductInput }) => productInputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const product = validateProduct(data.product);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(product).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("products").insert(product);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, string>) => settingsInputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const keys = [
      "whatsapp",
      "phone",
      "email",
      "addressEn",
      "addressUr",
      "mapQuery",
      "heroTitleEn",
      "heroTitleUr",
      "heroSubtitleEn",
      "heroSubtitleUr",
      "announcementEn",
      "announcementUr",
    ] as const;
    const payload: Record<string, string> = {};
    for (const key of keys) payload[key] = clean(data[key], 500);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("settings").update({ data: payload }).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const imageInputSchema = {
  name: (value: unknown) => clean(value, 120).replace(/[^a-zA-Z0-9._-]/g, "-"),
  type: (value: unknown) => clean(value, 40),
  data: (value: unknown) => String(value ?? ""),
};

export const uploadProductImage = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; type: string; data: string }) => {
    if (typeof input.data !== "string" || input.data.length > 7_000_000) throw new Error("Image must be 5 MB or smaller");
    return {
      name: imageInputSchema.name(input.name),
      type: imageInputSchema.type(input.type),
      data: imageInputSchema.data(input.data),
    };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.name) throw new Error("Choose an image file");
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(data.type)) {
      throw new Error("Use a JPG, PNG or WebP image");
    }
    const match = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(data.data);
    if (!match?.[1]) throw new Error("The image could not be read");
    const bytes = Buffer.from(match[1], "base64");
    if (!bytes.byteLength || bytes.byteLength > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller");
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isWebp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!(data.type === "image/jpeg" && isJpeg || data.type === "image/png" && isPng || data.type === "image/webp" && isWebp)) {
      throw new Error("The file is not a valid image of the selected type");
    }

    const extension = data.type === "image/jpeg" ? "jpg" : data.type.split("/")[1];
    const stem = data.name.replace(/\.[^.]+$/, "").slice(0, 60) || "product";
    const path = `${Date.now()}-${crypto.randomUUID()}-${stem}.${extension}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("product-images").upload(path, bytes, {
      contentType: data.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new Error("Image upload failed");
    const { data: signed, error: signedError } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signedError || !signed.signedUrl) throw new Error("Image link could not be created");
    return { url: signed.signedUrl };
  });
