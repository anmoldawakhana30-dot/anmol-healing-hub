import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { money, useLang } from "@/lib/i18n";
import { products as defaultProducts, getProduct } from "@/lib/products";
import { orderMessage, waLink } from "@/lib/shop";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => ({ product: getProduct(params.slug) ?? null }),
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return { meta: [{ title: "Medicine not found — Anmol Dawakhana" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name.en} — Anmol Dawakhana` },
        { name: "description", content: p.short.en },
        { property: "og:title", content: `${p.name.en} — Anmol Dawakhana` },
        { property: "og:description", content: p.short.en },
      ],
    };
  },
  component: ProductDetail,
});

const sampleReviews = [
  { name: { en: "Ayesha K.", ur: "عائشہ ک" }, stars: 5, text: { en: "Quality is pure and delivery was fast.", ur: "کوالٹی خالص ہے اور ڈیلیوری بھی جلدی ہوئی۔" } },
  { name: { en: "Bilal A.", ur: "بلال ا" }, stars: 5, text: { en: "Using it for a month, feeling much better.", ur: "ایک ماہ سے استعمال کر رہا ہوں، کافی افاقہ ہے۔" } },
  { name: { en: "Nadia R.", ur: "نادیہ ر" }, stars: 4, text: { en: "Good packing, simple instructions.", ur: "پیکنگ اچھی ہے اور ہدایات آسان ہیں۔" } },
];

function ProductDetail() {
  const { slug } = Route.useParams();
  const { products, getProduct: fromStore } = useStore();
  const product = fromStore(slug) ?? defaultProducts.find((p) => p.slug === slug);
  const { lang, t } = useLang();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-muted-foreground">{t("no_results")}</p>
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

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const current = product;
  const addToCart = () => {
    add(current.slug, qty);
    toast.success(t("added"), { description: current.name[lang] });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="surface-panel overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.name[lang]}
            width={816}
            height={816}
            fetchPriority="high"
            decoding="async"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-emerald-deep sm:text-3xl">{product.name[lang]}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(product.rating) ? "size-4 fill-gold text-gold" : "size-4 text-border"}
                />
              ))}
            </span>
            <span>
              {product.rating.toFixed(1)} · {product.reviews}
            </span>
          </div>

          <p className="mt-4 text-muted-foreground">{product.description[lang]}</p>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-emerald-deep">{money(product.price)}</span>
            {product.oldPrice && (
              <span className="pb-1 text-sm text-muted-foreground line-through">{money(product.oldPrice)}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("pack")}: {product.pack[lang]}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="-"
                className="size-10 text-lg text-muted-foreground"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="+" className="size-10 text-lg text-muted-foreground">
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
            >
              {t("add_to_cart")}
            </button>
            <button
              onClick={() => {
                add(product.slug, qty);
                navigate({ to: "/checkout" });
              }}
              className="rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary"
            >
              {t("buy_now")}
            </button>
            <a
              href={waLink(
                orderMessage([
                  { name: `${product.name.en} (${product.pack.en})`, price: money(product.price), qty },
                ]),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <MessageCircle className="size-4" />
              {t("wa_order")}
            </a>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="font-semibold">{t("benefits")}</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {product.benefits.map((x) => (
                  <li key={x.en} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {x[lang]}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-semibold">{t("ingredients")}</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.ingredients.map((x) => (
                  <li key={x.en} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {x[lang]}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="surface-panel mt-6 bg-accent p-4">
            <h2 className="font-semibold text-accent-foreground">{t("dosage")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.dosage[lang]}</p>
          </section>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{t("reviews")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {sampleReviews.map((r) => (
            <article key={r.name.en} className="surface-panel p-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < r.stars ? "size-3.5 fill-gold text-gold" : "size-3.5 text-border"} />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.text[lang]}</p>
              <p className="mt-2 text-xs font-medium">{r.name[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("featured")}</h2>
            <Link
              to="/products"
              search={{ q: undefined, cat: product.category }}
              className="text-sm text-primary hover:underline"
            >
              {t("view_all")}
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
