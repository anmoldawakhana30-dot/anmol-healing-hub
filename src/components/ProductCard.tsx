import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { money, useLang } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang, t } = useLang();
  const { add } = useCart();

  return (
    <article className="group surface-panel flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name[lang]}
          width={816}
          height={816}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug sm:text-base">{product.name[lang]}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.pack[lang]}</p>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <span className="block text-base font-semibold text-emerald-deep">{money(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{money(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={() => {
              add(product.slug);
              toast.success(t("added"), { description: product.name[lang] });
            }}
            aria-label={`${t("add_to_cart")} — ${product.name[lang]}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-transform active:scale-95"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("add_to_cart")}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
