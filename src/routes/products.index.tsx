import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useLang } from "@/lib/i18n";
import { categories } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Search = { q?: string | undefined; cat?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    cat: typeof search["cat"] === "string" && search["cat"] ? search["cat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All Herbal Medicines — Anmol Dawakhana" },
      {
        name: "description",
        content: "Browse herbal teas, oils, syrups, immunity boosters and wellness powders. Filter and search easily.",
      },
      { property: "og:title", content: "All Herbal Medicines — Anmol Dawakhana" },
      { property: "og:description", content: "Browse and order authentic herbal medicines online." },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { products } = useStore();
  const [sort, setSort] = useState<"popular" | "low" | "high">("popular");

  const list = useMemo(() => {
    const term = (q ?? "").toLowerCase().trim();
    let out = products.filter((p) => {
      const inCat = !cat || p.category === cat;
      const inTerm =
        !term ||
        p.name.en.toLowerCase().includes(term) ||
        p.name.ur.includes(term) ||
        p.short.en.toLowerCase().includes(term);
      return inCat && inTerm;
    });
    out = [...out].sort((a, b) =>
      sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.popularity - a.popularity,
    );
    return out;
  }, [q, cat, sort, products]);

  function setCat(next: string | undefined) {
    navigate({ to: "/products", search: { q, cat: next } });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-emerald-deep">{t("nav_shop")}</h1>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCat(undefined)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            !cat ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary",
          )}
        >
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              cat === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary",
            )}
          >
            {c.name[lang]}
          </button>
        ))}

        <label className="ms-auto flex items-center gap-2 text-sm text-muted-foreground">
          {t("sort")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
          >
            <option value="popular">{t("sort_popular")}</option>
            <option value="low">{t("sort_low")}</option>
            <option value="high">{t("sort_high")}</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">{t("no_results")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
