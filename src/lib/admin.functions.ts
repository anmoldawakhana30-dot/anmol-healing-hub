import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "ad-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
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
  .inputValidator((data: { id?: string | null; product: ProductInput }) => data)
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
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, string>) => data)
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
