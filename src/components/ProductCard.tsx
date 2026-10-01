import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { WhatsAppOrderDialog } from "@/components/WhatsAppOrderDialog";
import { money, useLang } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang, t } = useLang();

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

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="min-w-0">
            <span className="block text-base font-semibold text-emerald-deep">{money(product.price, lang)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{money(product.oldPrice, lang)}</span>
            )}
          </div>
          <WhatsAppOrderDialog product={product} compact />
        </div>
      </div>
    </article>
  );
}
