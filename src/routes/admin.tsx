import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  deleteProduct,
  listAdminProducts,
  saveProduct,
  saveSettings,
  type ProductInput,
} from "@/lib/admin.functions";
import { categories } from "@/lib/products";
import { defaultSettings, type Settings } from "@/lib/shop";
import { fetchSettings, resolveImage } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Anmol Dawakhana" },
      { name: "description", content: "Private management area for Anmol Dawakhana products and clinic details." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const field =
  "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

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
  urdu?: boolean;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      {props.textarea ? (
        <textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          rows={3}
          dir={props.urdu ? "rtl" : "ltr"}
          className={cn(field, props.urdu && "font-urdu")}
          placeholder={props.placeholder ?? ""}
        />
      ) : (
        <input
          value={props.value}
          type={props.type ?? "text"}
          onChange={(e) => props.onChange(e.target.value)}
          dir={props.urdu ? "rtl" : "ltr"}
          className={cn(field, props.urdu && "font-urdu")}
          placeholder={props.placeholder ?? ""}
        />
      )}
    </label>
  );
}

function PairList(props: {
  label: string;
  items: { en: string; ur: string }[];
  onChange: (items: { en: string; ur: string }[]) => void;
}) {
  const { items, onChange } = props;
  return (
    <div>
      <span className="text-sm font-medium">{props.label}</span>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item.en}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, en: e.target.value } : x)))}
              placeholder="English"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={item.ur}
              dir="rtl"
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, ur: e.target.value } : x)))}
              placeholder="اردو"
              className="font-urdu w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-xl border border-border px-3 text-muted-foreground hover:text-destructive"
              aria-label="remove"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { en: "", ur: "" }])}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"
      >
        <Plus className="size-3.5" /> Add line / نئی سطر
      </button>
    </div>
  );
}

function AdminPage() {
  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => adminStatus() });

  if (status.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!status.data?.admin) {
    return <LoginCard configured={status.data?.configured ?? false} onDone={() => status.refetch()} />;
  }

  return <Dashboard onSignOut={() => status.refetch()} />;
}

function LoginCard({ configured, onDone }: { configured: boolean; onDone: () => void }) {
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await login({ data: { password } });
      if (res.ok) {
        setPassword("");
        onDone();
      } else if (res.reason === "not_configured") {
        setError("No admin password has been set for this site yet.");
      } else {
        setError("Wrong password / پاس ورڈ غلط ہے");
      }
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <form onSubmit={submit} className="surface-panel space-y-4 p-6 text-center">
        <Lock className="mx-auto size-8 text-primary" />
        <h1 className="text-xl font-semibold text-emerald-deep">Admin Login</h1>
        <p className="font-urdu text-sm text-muted-foreground">ایڈمن لاگ ان</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password / پاس ورڈ"
          autoComplete="current-password"
          className={field}
        />
        {!configured && (
          <p className="text-xs text-muted-foreground">Ask your developer to set the admin password first.</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Please wait..." : "Sign in / داخل ہوں"}
        </button>
      </form>
    </div>
  );
}

type Row = ProductInput & { id: string };

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listAdminProducts);
  const logout = useServerFn(adminLogout);
  const [tab, setTab] = useState<"products" | "settings">("products");

  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-deep">Admin Panel</h1>
          <p className="font-urdu text-sm text-muted-foreground">انتظامی پینل</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            qc.clear();
            onSignOut();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {(
          [
            ["products", "Products / ادویات"],
            ["settings", "Clinic details / دواخانہ کی معلومات"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              tab === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <ProductsTab rows={(products.data as unknown as Row[]) ?? []} loading={products.isLoading} />
      ) : (
        <SettingsTab />
      )}
    </div>
  );
}

function ProductsTab({ rows, loading }: { rows: Row[]; loading: boolean }) {
  const qc = useQueryClient();
  const save = useServerFn(saveProduct);
  const del = useServerFn(deleteProduct);
  const [editing, setEditing] = useState<{ id: string | null; data: ProductInput } | null>(null);
  const [busy, setBusy] = useState(false);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await save({ data: { id: editing.id, product: editing.data } });
      toast.success("Saved / محفوظ ہو گیا");
      setEditing(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Remove "${row.name_en}"? / کیا یہ دوا ہٹا دیں؟`)) return;
    try {
      await del({ data: { id: row.id } });
      toast.success("Removed / ہٹا دیا گیا");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove");
    }
  }

  if (editing) {
    const d = editing.data;
    const set = (patch: Partial<ProductInput>) => setEditing({ ...editing, data: { ...d, ...patch } });

    return (
      <form onSubmit={submit} className="surface-panel mt-6 space-y-5 p-5">
        <h2 className="text-lg font-semibold">{editing.id ? "Edit product" : "Add new product"}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English)" value={d.name_en} onChange={(v) => set({ name_en: v })} />
          <Field label="عنوان (اردو)" urdu value={d.name_ur} onChange={(v) => set({ name_ur: v })} />
          <label className="block">
            <span className="text-sm font-medium">Category / قسم</span>
            <select value={d.category} onChange={(e) => set({ category: e.target.value })} className={field}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name.en} — {c.name.ur}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Web address (slug) — leave as is if unsure"
            value={d.slug}
            onChange={(v) => set({ slug: v })}
            placeholder="joshanda-special"
          />
          <Field label="Price (Rs.)" type="number" value={d.price} onChange={(v) => set({ price: Number(v) })} />
          <Field
            label="Old price (optional)"
            type="number"
            value={d.old_price ?? ""}
            onChange={(v) => set({ old_price: v === "" ? null : Number(v) })}
          />
          <Field label="Pack size (English)" value={d.pack_en} onChange={(v) => set({ pack_en: v })} placeholder="200 g" />
          <Field label="پیک سائز (اردو)" urdu value={d.pack_ur} onChange={(v) => set({ pack_ur: v })} placeholder="200 گرام" />
          <Field
            label="Photo link (paste image URL, or write tea / oil / syrup)"
            value={d.image}
            onChange={(v) => set({ image: v })}
            placeholder="https://..."
          />
          <div className="flex items-end">
            <img
              src={resolveImage(d.image)}
              alt=""
              className="size-16 rounded-xl border border-border object-cover"
            />
          </div>
          <Field label="Short line (English)" value={d.short_en} onChange={(v) => set({ short_en: v })} />
          <Field label="مختصر جملہ (اردو)" urdu value={d.short_ur} onChange={(v) => set({ short_ur: v })} />
          <Field label="Description (English)" textarea value={d.description_en} onChange={(v) => set({ description_en: v })} />
          <Field label="تفصیل (اردو)" urdu textarea value={d.description_ur} onChange={(v) => set({ description_ur: v })} />
          <Field label="Usage / dosage (English)" textarea value={d.dosage_en} onChange={(v) => set({ dosage_en: v })} />
          <Field label="طریقہ استعمال (اردو)" urdu textarea value={d.dosage_ur} onChange={(v) => set({ dosage_ur: v })} />
        </div>

        <PairList label="Benefits / فوائد" items={d.benefits} onChange={(benefits) => set({ benefits })} />
        <PairList label="Ingredients / اجزاء" items={d.ingredients} onChange={(ingredients) => set({ ingredients })} />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save / محفوظ کریں"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-full border border-border px-6 py-3 text-sm"
          >
            Cancel / منسوخ
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setEditing({ id: null, data: { ...emptyProduct } })}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        <Plus className="size-4" /> Add new product / نئی دوا شامل کریں
      </button>

      {loading ? (
        <p className="mt-8 text-center text-muted-foreground">Loading...</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="surface-panel flex items-center gap-3 p-3">
              <img
                src={resolveImage(row.image)}
                alt=""
                className="size-14 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{row.name_en}</p>
                <p className="font-urdu truncate text-sm text-muted-foreground">{row.name_ur}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-emerald-deep">Rs. {row.price}</span>
              <button
                onClick={() => setEditing({ id: row.id, data: { ...row } })}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-primary"
                aria-label="edit"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => remove(row)}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive"
                aria-label="delete"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SettingsTab() {
  const qc = useQueryClient();
  const save = useServerFn(saveSettings);
  const current = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const [draft, setDraft] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);

  const data = draft ?? current.data ?? defaultSettings;
  const set = (patch: Partial<Settings>) => setDraft({ ...data, ...patch });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await save({ data: data as unknown as Record<string, string> });
      toast.success("Saved / محفوظ ہو گیا");
      qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface-panel mt-6 grid gap-4 p-5 sm:grid-cols-2">
      <Field
        label="WhatsApp number (digits only, with country code)"
        value={data.whatsapp}
        onChange={(v) => set({ whatsapp: v })}
        placeholder="923072560758"
      />
      <Field label="Phone number shown on site" value={data.phone} onChange={(v) => set({ phone: v })} />
      <Field label="Email" value={data.email} onChange={(v) => set({ email: v })} />
      <Field label="Google Maps location (address or link)" value={data.mapQuery} onChange={(v) => set({ mapQuery: v })} />
      <Field label="Address (English)" value={data.addressEn} onChange={(v) => set({ addressEn: v })} />
      <Field label="پتہ (اردو)" urdu value={data.addressUr} onChange={(v) => set({ addressUr: v })} />
      <Field label="Banner heading (English)" value={data.heroTitleEn} onChange={(v) => set({ heroTitleEn: v })} />
      <Field label="بینر عنوان (اردو)" urdu value={data.heroTitleUr} onChange={(v) => set({ heroTitleUr: v })} />
      <Field
        label="Banner text (English)"
        textarea
        value={data.heroSubtitleEn}
        onChange={(v) => set({ heroSubtitleEn: v })}
      />
      <Field label="بینر تفصیل (اردو)" urdu textarea value={data.heroSubtitleUr} onChange={(v) => set({ heroSubtitleUr: v })} />
      <Field
        label="Announcement (English, leave empty to hide)"
        value={data.announcementEn}
        onChange={(v) => set({ announcementEn: v })}
      />
      <Field label="اعلان (اردو)" urdu value={data.announcementUr} onChange={(v) => set({ announcementUr: v })} />

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save / محفوظ کریں"}
        </button>
      </div>
    </form>
  );
}
