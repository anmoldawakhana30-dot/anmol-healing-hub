import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ImagePlus, Loader2, LogOut, Lock, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  deleteProduct,
  listAdminProducts,
  saveProduct,
  saveSettings,
  uploadProductImage,
  type ProductInput,
} from "@/lib/admin.functions";
import { categories } from "@/lib/products";
import { useLang } from "@/lib/i18n";
import { defaultSettings, type Settings as ShopSettings } from "@/lib/shop";
import { fetchSettings, resolveImage } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Shop Management — Anmol Dawakhana" },
      { name: "description", content: "Private product and clinic management for Anmol Dawakhana." },
      { property: "og:title", content: "Shop Management — Anmol Dawakhana" },
      { property: "og:description", content: "Private product and clinic management for Anmol Dawakhana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const field = "mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20";

const emptyProduct: ProductInput = {
  slug: "",
  name_en: "",
  name_ur: "",
  category: "herbal-teas",
  price: 0,
  old_price: null,
  pack_en: "",
  pack_ur: "",
  image: "tea",
  short_en: "",
  short_ur: "",
  description_en: "",
  description_ur: "",
  benefits: [],
  ingredients: [],
  dosage_en: "",
  dosage_ur: "",
};

function Field(props: {
  label: string;
  hint?: string;
  urdu?: boolean;
  value: string | number;
  onChange: (value: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const control = props.textarea ? (
    <textarea
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      rows={4}
      dir={props.urdu ? "rtl" : "ltr"}
      className={cn(field, props.urdu && "font-urdu")}
      placeholder={props.placeholder ?? ""}
      required={props.required}
    />
  ) : (
    <input
      value={props.value}
      type={props.type ?? "text"}
      onChange={(event) => props.onChange(event.target.value)}
      dir={props.urdu ? "rtl" : "ltr"}
      className={cn(field, props.urdu && "font-urdu")}
      placeholder={props.placeholder ?? ""}
      required={props.required}
    />
  );

  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      {props.hint && <span className="mt-0.5 block text-xs text-muted-foreground">{props.hint}</span>}
      {control}
    </label>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-5 first:border-0 first:pt-0">
      <h3 className="font-semibold text-emerald-deep">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PairList(props: {
  label: string;
  items: { en: string; ur: string }[];
  onChange: (items: { en: string; ur: string }[]) => void;
}) {
  const { lang } = useLang();
  return (
    <div>
      <span className="text-sm font-medium">{props.label}</span>
      <div className="mt-2 space-y-2">
        {props.items.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={item.en}
              onChange={(event) => props.onChange(props.items.map((value, itemIndex) => itemIndex === index ? { ...value, en: event.target.value } : value))}
              placeholder={lang === "ur" ? "انگریزی" : "English"}
              className={field}
            />
            <input
              value={item.ur}
              dir="rtl"
              onChange={(event) => props.onChange(props.items.map((value, itemIndex) => itemIndex === index ? { ...value, ur: event.target.value } : value))}
              placeholder="اردو"
              className={cn(field, "font-urdu")}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => props.onChange(props.items.filter((_, itemIndex) => itemIndex !== index))} aria-label={lang === "ur" ? "لائن ہٹائیں" : "Remove line"}>
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => props.onChange([...props.items, { en: "", ur: "" }])}>
        <Plus /> {lang === "ur" ? "مزید شامل کریں" : "Add another"}
      </Button>
    </div>
  );
}

function AdminPage() {
  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => adminStatus() });
  if (status.isLoading) return <Loading />;
  if (status.isError) return <div className="mx-auto max-w-sm px-4 py-20 text-center"><p className="text-destructive">Could not load the admin panel. / انتظامی صفحہ نہیں کھل سکا۔</p><Button className="mt-4" onClick={() => status.refetch()}>Try again / دوبارہ کوشش کریں</Button></div>;
  if (!status.data?.admin) return <Login configured={status.data?.configured ?? false} onDone={() => status.refetch()} />;
  return <Dashboard onSignOut={() => status.refetch()} />;
}

function Loading() {
  return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
}

function Login({ configured, onDone }: { configured: boolean; onDone: () => void }) {
  const { lang } = useLang();
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await login({ data: { password } });
      if (result.ok) {
        setPassword("");
        onDone();
      } else {
        setError(result.reason === "not_configured" ? "The admin password is not configured." : "Wrong password / پاس ورڈ درست نہیں");
      }
    } catch {
      setError("Sign in failed. Please try again. / دوبارہ کوشش کریں۔");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <form onSubmit={submit} className="surface-panel space-y-4 p-6 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-md bg-accent text-primary"><Lock className="size-5" /></span>
         <h1 className="text-xl font-semibold text-emerald-deep">{lang === "ur" ? "دکان کا انتظام" : "Shop Management"}</h1>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password / پاس ورڈ" autoComplete="current-password" className={field} required />
        {!configured && <p className="text-xs text-destructive">The admin password is not configured.</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
         <Button type="submit" disabled={busy} className="h-11 w-full">{busy && <Loader2 className="animate-spin" />}{busy ? (lang === "ur" ? "انتظار کریں..." : "Signing in...") : (lang === "ur" ? "داخل ہوں" : "Sign in")}</Button>
      </form>
    </div>
  );
}

type Row = ProductInput & { id: string };

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const { lang } = useLang();
  const label = (en: string, ur: string) => lang === "ur" ? ur : en;
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminProducts);
  const logout = useServerFn(adminLogout);
  const [tab, setTab] = useState<"products" | "settings">("products");
  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div><h1 className="text-2xl font-semibold text-emerald-deep">{label("Shop Management", "دکان کا انتظام")}</h1></div>
        <Button variant="outline" onClick={async () => { await logout(); queryClient.clear(); onSignOut(); }}><LogOut /> {label("Sign out", "باہر جائیں")}</Button>
      </header>
      <div className="mt-6 inline-flex rounded-md border border-border bg-card p-1">
        <Button variant={tab === "products" ? "default" : "ghost"} onClick={() => setTab("products")}><ImagePlus /> {label("Products", "ادویات")}</Button>
        <Button variant={tab === "settings" ? "default" : "ghost"} onClick={() => setTab("settings")}><Settings /> {label("Clinic settings", "دواخانے کی معلومات")}</Button>
      </div>
      {tab === "products" ? <Products rows={(products.data as Row[] | undefined) ?? []} loading={products.isLoading} error={products.isError} /> : <ClinicSettings />}
    </div>
  );
}

function Products({ rows, loading, error }: { rows: Row[]; loading: boolean; error: boolean }) {
  const { lang } = useLang();
  const label = (en: string, ur: string) => lang === "ur" ? ur : en;
  const queryClient = useQueryClient();
  const save = useServerFn(saveProduct);
  const removeProduct = useServerFn(deleteProduct);
  const upload = useServerFn(uploadProductImage);
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<{ id: string | null; data: ProductInput } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await save({ data: { id: editing.id, product: editing.data } });
      toast.success("Product saved / دوا محفوظ ہو گئی");
      setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Product could not be saved");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file: File) {
    if (!editing) return;
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) { toast.error("Use a JPG, PNG or WebP image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be 5 MB or smaller"); return; }
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Image could not be read"));
        reader.onerror = () => reject(new Error("Image could not be read"));
        reader.readAsDataURL(file);
      });
      const result = await upload({ data: { name: file.name, type: file.type, data } });
      setEditing((current) => current ? { ...current, data: { ...current.data, image: result.url } } : current);
      toast.success("Photo uploaded / تصویر اپ لوڈ ہو گئی");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Photo upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete “${row.name_en || row.name_ur}”? This cannot be undone.`)) return;
    try {
      await removeProduct({ data: { id: row.id } });
      toast.success("Product deleted / دوا حذف ہو گئی");
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Product could not be deleted");
    }
  }

  if (editing) {
    const data = editing.data;
    const set = (patch: Partial<ProductInput>) => setEditing({ ...editing, data: { ...data, ...patch } });
    return (
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Button type="button" variant="outline" size="icon" onClick={() => setEditing(null)} aria-label={label("Back", "واپس")}><ArrowLeft /></Button><h2 className="text-xl font-semibold">{editing.id ? label("Edit product", "دوا کی معلومات بدلیں") : label("Add a product", "نئی دوا شامل کریں")}</h2></div>
          <Button type="submit" disabled={busy || uploading}>{busy && <Loader2 className="animate-spin" />}{busy ? label("Saving...", "محفوظ ہو رہا ہے...") : label("Save product", "دوا محفوظ کریں")}</Button>
        </div>

        <div className="surface-panel space-y-6 p-5 sm:p-6">
          <Section title={label("Basic details", "بنیادی معلومات")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={label("Product name in English", "انگریزی نام")} value={data.name_en} onChange={(value) => set({ name_en: value })} required />
              <Field label="دوا کا نام اردو میں" urdu value={data.name_ur} onChange={(value) => set({ name_ur: value })} required />
              <label className="block text-sm font-medium">{label("Category", "قسم")}<select value={data.category} onChange={(event) => set({ category: event.target.value })} className={field}>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name[lang]}</option>)}</select></label>
              <Field label={label("Web address", "ویب پتہ")} hint={label("Created automatically if left empty.", "خالی چھوڑنے پر خود بن جائے گا۔")} value={data.slug} onChange={(value) => set({ slug: value })} placeholder="special-joshanda" />
            </div>
          </Section>

          <Section title={label("Price and pack", "قیمت اور پیکنگ")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={label("Price (Rs.)", "قیمت (روپے)")} type="number" value={data.price} onChange={(value) => set({ price: Number(value) })} required />
              <Field label={label("Old price (optional)", "پرانے دام (اختیاری)")} type="number" value={data.old_price ?? ""} onChange={(value) => set({ old_price: value === "" ? null : Number(value) })} />
              <Field label={label("Pack size in English", "انگریزی میں پیک کا وزن")} value={data.pack_en} onChange={(value) => set({ pack_en: value })} placeholder="200 g" />
              <Field label="پیک کا وزن اردو میں" urdu value={data.pack_ur} onChange={(value) => set({ pack_ur: value })} placeholder="200 گرام" />
            </div>
          </Section>

          <Section title={label("Product photo", "دوا کی تصویر")} description={label("Upload a JPG, PNG or WebP photo up to 5 MB, or paste an image link.", "5 ایم بی تک تصویر اپ لوڈ کریں یا تصویر کا لنک لکھیں۔")}>
            <div className="grid gap-4 sm:grid-cols-[144px_1fr] sm:items-start">
              <img src={resolveImage(data.image)} alt="Product preview" className="aspect-square w-36 rounded-md border border-border object-cover" />
              <div>
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadFile(file); }} />
                 <Button type="button" variant="outline" disabled={uploading} onClick={() => fileInput.current?.click()}>{uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}{uploading ? label("Uploading...", "تصویر اپ لوڈ ہو رہی ہے...") : label("Upload photo", "تصویر اپ لوڈ کریں")}</Button>
                 <div className="mt-4"><Field label={label("Or paste an image URL", "یا تصویر کا لنک لکھیں")} value={data.image} onChange={(value) => set({ image: value })} placeholder="https://..." /></div>
              </div>
            </div>
          </Section>

          <Section title={label("Description", "تفصیل")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={label("Short line in English", "انگریزی میں مختصر جملہ")} value={data.short_en} onChange={(value) => set({ short_en: value })} />
              <Field label="مختصر جملہ اردو میں" urdu value={data.short_ur} onChange={(value) => set({ short_ur: value })} />
              <Field label={label("Full description in English", "انگریزی میں مکمل تفصیل")} textarea value={data.description_en} onChange={(value) => set({ description_en: value })} />
              <Field label="مکمل تفصیل اردو میں" urdu textarea value={data.description_ur} onChange={(value) => set({ description_ur: value })} />
            </div>
          </Section>

          <Section title={label("Benefits and ingredients", "فوائد اور اجزاء")}>
            <div className="grid gap-6 lg:grid-cols-2"><PairList label={label("Benefits", "فوائد")} items={data.benefits} onChange={(benefits) => set({ benefits })} /><PairList label={label("Ingredients", "اجزاء")} items={data.ingredients} onChange={(ingredients) => set({ ingredients })} /></div>
          </Section>

          <Section title={label("How to use", "طریقہ استعمال")}>
            <div className="grid gap-4 sm:grid-cols-2"><Field label={label("Instructions in English", "انگریزی میں استعمال کا طریقہ")} textarea value={data.dosage_en} onChange={(value) => set({ dosage_en: value })} /><Field label="استعمال کا طریقہ اردو میں" urdu textarea value={data.dosage_ur} onChange={(value) => set({ dosage_ur: value })} /></div>
          </Section>
        </div>
      </form>
    );
  }

  return (
    <section className="mt-6">
       <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-xl font-semibold">{label("Products", "ادویات")}</h2><Button onClick={() => setEditing({ id: null, data: { ...emptyProduct } })}><Plus /> {label("Add product", "نئی دوا")}</Button></div>
       {loading ? <Loading /> : error ? <p className="mt-8 text-center text-destructive">{label("Products could not be loaded. Please refresh.", "ادویات لوڈ نہیں ہوئیں۔ صفحہ دوبارہ کھولیں۔")}</p> : rows.length === 0 ? <p className="mt-8 border-y border-border py-10 text-center text-muted-foreground">{label("No products yet. Add your first product.", "ابھی کوئی دوا نہیں۔ پہلی دوا شامل کریں۔")}</p> : (
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-3 py-3">
              <img src={resolveImage(row.image)} alt="" className="size-16 shrink-0 rounded-md object-cover" loading="lazy" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{row.name_en}</p><p className="font-urdu truncate text-sm text-muted-foreground">{row.name_ur}</p><p className="text-xs text-muted-foreground">Rs. {row.price} · {row.pack_en}</p></div>
               <Button variant="outline" size="icon" onClick={() => setEditing({ id: row.id, data: { ...row } })} aria-label={`${label("Edit", "بدلیں")} ${row.name_en}`}><Pencil /></Button>
               <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(row)} aria-label={`${label("Delete", "ہٹائیں")} ${row.name_en}`}><Trash2 /></Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ClinicSettings() {
  const { lang } = useLang();
  const label = (en: string, ur: string) => lang === "ur" ? ur : en;
  const queryClient = useQueryClient();
  const save = useServerFn(saveSettings);
  const current = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const [draft, setDraft] = useState<ShopSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const data = draft ?? current.data ?? defaultSettings;
  const set = (patch: Partial<ShopSettings>) => setDraft({ ...data, ...patch });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await save({ data: data as unknown as Record<string, string> });
      toast.success("Clinic details saved / معلومات محفوظ ہو گئیں");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setDraft(null);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Details could not be saved");
    } finally {
      setBusy(false);
    }
  }

  if (current.isLoading) return <Loading />;
  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
       <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-xl font-semibold">{label("Clinic settings", "دواخانے کی معلومات")}</h2><Button type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{busy ? label("Saving...", "محفوظ ہو رہا ہے...") : label("Save changes", "تبدیلیاں محفوظ کریں")}</Button></div>
      <div className="surface-panel space-y-6 p-5 sm:p-6">
         <Section title={label("Contact details", "رابطے کی معلومات")}><div className="grid gap-4 sm:grid-cols-2"><Field label={label("WhatsApp number", "واٹس ایپ نمبر")} hint={label("Country code and digits only.", "ملکی کوڈ اور صرف نمبر لکھیں۔")} value={data.whatsapp} onChange={(value) => set({ whatsapp: value })} placeholder="923072560758" /><Field label={label("Phone number shown on website", "ویب سائٹ پر دکھایا جانے والا فون نمبر")} value={data.phone} onChange={(value) => set({ phone: value })} /><Field label={label("Email address", "ای میل پتہ")} type="email" value={data.email} onChange={(value) => set({ email: value })} /><Field label={label("Google Maps address or link", "گوگل نقشے کا پتہ یا لنک")} value={data.mapQuery} onChange={(value) => set({ mapQuery: value })} /></div></Section>
         <Section title={label("Clinic address", "دواخانے کا پتہ")}><div className="grid gap-4 sm:grid-cols-2"><Field label={label("Address in English", "انگریزی میں پتہ")} textarea value={data.addressEn} onChange={(value) => set({ addressEn: value })} /><Field label="پتہ اردو میں" urdu textarea value={data.addressUr} onChange={(value) => set({ addressUr: value })} /></div></Section>
         <Section title={label("Home banner", "مرکزی پیغام")}><div className="grid gap-4 sm:grid-cols-2"><Field label={label("Heading in English", "انگریزی میں عنوان")} value={data.heroTitleEn} onChange={(value) => set({ heroTitleEn: value })} /><Field label="عنوان اردو میں" urdu value={data.heroTitleUr} onChange={(value) => set({ heroTitleUr: value })} /><Field label={label("Short text in English", "انگریزی میں مختصر عبارت")} textarea value={data.heroSubtitleEn} onChange={(value) => set({ heroSubtitleEn: value })} /><Field label="مختصر عبارت اردو میں" urdu textarea value={data.heroSubtitleUr} onChange={(value) => set({ heroSubtitleUr: value })} /></div></Section>
         <Section title={label("Emergency announcement", "ضروری اعلان")} description={label("Leave both boxes empty to hide the announcement.", "اعلان چھپانے کے لیے دونوں خانے خالی چھوڑ دیں۔")}><div className="grid gap-4 sm:grid-cols-2"><Field label={label("Announcement in English", "انگریزی میں اعلان")} textarea value={data.announcementEn} onChange={(value) => set({ announcementEn: value })} /><Field label="ضروری اعلان اردو میں" urdu textarea value={data.announcementUr} onChange={(value) => set({ announcementUr: value })} /></div></Section>
      </div>
    </form>
  );
}