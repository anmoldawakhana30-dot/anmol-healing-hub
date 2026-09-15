import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { money, useLang } from "@/lib/i18n";
import { SHOP, waLink } from "@/lib/shop";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Anmol Dawakhana" },
      { name: "description", content: "Guest checkout with cash on delivery, online payment or WhatsApp ordering." },
      { property: "og:title", content: "Checkout — Anmol Dawakhana" },
      { property: "og:description", content: "Fast guest checkout, no account needed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

type Form = { name: string; phone: string; address: string; city: string; notes: string };

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { t, lang } = useLang();
  const [form, setForm] = useState<Form>({ name: "", phone: "", address: "", city: "", notes: "" });
  const [pay, setPay] = useState<"cod" | "online">("cod");
  const [errors, setErrors] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [done, setDone] = useState(false);

  const delivery = subtotal === 0 || subtotal >= SHOP.freeShippingOver ? 0 : SHOP.deliveryFee;
  const total = subtotal + delivery;

  const set = (k: keyof Form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const next = {
      name: form.name.trim().length < 3,
      phone: !/^(\+?92|0)?3\d{9}$/.test(form.phone.replace(/[\s-]/g, "")),
      address: form.address.trim().length < 10,
      city: form.city.trim().length < 2,
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  function orderText() {
    const lines = items.map((i) => `• ${i.product.name.en} (${i.product.pack.en}) x${i.qty} — ${money(i.product.price * i.qty)}`);
    return [
      "Assalam o Alaikum, I want to place this order:",
      ...lines,
      `Total: ${money(total)}`,
      `Name: ${form.name || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Address: ${form.address || "-"}, ${form.city || "-"}`,
      form.notes ? `Note: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setDone(true);
    clear();
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold text-emerald-deep">{t("order_done")}</h1>
        <p className="mt-2 text-muted-foreground">{t("order_done_d")}</p>
        <Link
          to="/products"
          search={{ q: undefined, cat: undefined }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">{t("cart_empty")}</p>
        <Link
          to="/products"
          search={{ q: undefined, cat: undefined }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-emerald-deep">{t("checkout_title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("guest_note")}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="surface-panel space-y-4 p-5">
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              {t("full_name")}
            </label>
            <input id="name" value={form.name} onChange={set("name")} className={field} autoComplete="name" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{t("required")}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="phone">
              {t("phone")}
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={set("phone")}
              inputMode="tel"
              dir="ltr"
              placeholder="03001234567"
              className={field}
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-muted-foreground">{t("phone_hint")}</p>
            {errors.phone && <p className="mt-1 text-xs text-destructive">{t("required")}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="address">
              {t("address")}
            </label>
            <textarea id="address" rows={3} value={form.address} onChange={set("address")} className={field} />
            {errors.address && <p className="mt-1 text-xs text-destructive">{t("required")}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="city">
              {t("city")}
            </label>
            <input id="city" value={form.city} onChange={set("city")} className={field} autoComplete="address-level2" />
            {errors.city && <p className="mt-1 text-xs text-destructive">{t("required")}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="notes">
              {t("notes")}
            </label>
            <input id="notes" value={form.notes} onChange={set("notes")} className={field} />
          </div>

          <fieldset>
            <legend className="text-sm font-medium">{t("payment")}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  { id: "cod", title: t("cod"), desc: t("cod_d") },
                  { id: "online", title: t("online"), desc: t("online_d") },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3 text-sm transition-colors",
                    pay === opt.id ? "border-primary bg-accent" : "border-border bg-card",
                  )}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="sr-only"
                    checked={pay === opt.id}
                    onChange={() => setPay(opt.id)}
                  />
                  <span className="block font-medium">{opt.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{opt.desc}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99]"
          >
            {t("place_order")} · {money(total)}
          </button>

          <a
            href={waLink(orderText())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-sm font-medium text-primary-foreground"
          >
            <MessageCircle className="size-4" />
            {t("wa_order")}
          </a>
        </form>

        <aside className="surface-panel h-fit p-5">
          <h2 className="font-semibold">{t("order_summary")}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{product.name[lang]}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("qty")}: {qty}
                  </span>
                </span>
                <span className="shrink-0">{money(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("subtotal")}</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("delivery")}</dt>
              <dd>{delivery === 0 ? t("free") : money(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>{t("total")}</dt>
              <dd className="text-emerald-deep">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
