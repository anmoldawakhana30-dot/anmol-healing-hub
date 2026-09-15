import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money, useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Anmol Dawakhana" },
      { name: "description", content: "Review the herbal medicines in your cart before checkout." },
      { property: "og:title", content: "Your Cart — Anmol Dawakhana" },
      { property: "og:description", content: "Review your herbal medicine order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const { t, lang } = useLang();
  const delivery = subtotal === 0 || subtotal >= SHOP.freeShippingOver ? 0 : SHOP.deliveryFee;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-emerald-deep">{t("cart_title")}</h1>

      {items.length === 0 ? (
        <div className="surface-panel mt-6 p-10 text-center">
          <p className="text-muted-foreground">{t("cart_empty")}</p>
          <Link
            to="/products"
            search={{ q: undefined, cat: undefined }}
            className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            {t("continue_shopping")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="surface-panel flex gap-3 p-3">
                <img
                  src={product.image}
                  alt={product.name[lang]}
                  width={816}
                  height={816}
                  loading="lazy"
                  decoding="async"
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="truncate text-sm font-medium hover:text-primary"
                  >
                    {product.name[lang]}
                  </Link>
                  <span className="text-xs text-muted-foreground">{product.pack[lang]}</span>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => setQty(product.slug, qty - 1)} aria-label="-" className="size-8 text-muted-foreground">
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button onClick={() => setQty(product.slug, qty + 1)} aria-label="+" className="size-8 text-muted-foreground">
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(product.slug)}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" /> {t("remove")}
                    </button>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-emerald-deep">{money(product.price * qty)}</span>
              </li>
            ))}
          </ul>

          <div className="surface-panel mt-6 p-5">
            <dl className="space-y-2 text-sm">
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
                <dd className="text-emerald-deep">{money(subtotal + delivery)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-5 block rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
            >
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
