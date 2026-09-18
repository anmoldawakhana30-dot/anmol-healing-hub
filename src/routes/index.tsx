import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Leaf, MessageCircle, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/ProductCard";
import { useLang } from "@/lib/i18n";
import { categories } from "@/lib/products";
import { useStore } from "@/lib/store";
import { SHOP, waLink } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anmol Dawakhana — Pure Herbal & Tibbi Medicines" },
      {
        name: "description",
        content:
          "Hand-prepared herbal teas, oils, syrups and immunity remedies from Anmol Dawakhana. Order online in English or Urdu with cash on delivery.",
      },
      { property: "og:title", content: "Anmol Dawakhana — Pure Herbal & Tibbi Medicines" },
      {
        property: "og:description",
        content: "Authentic herbal remedies prepared by our hakeems. Cash on delivery across Pakistan.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useLang();
  const { products, settings } = useStore();
  const featured = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const heroTitle = lang === "ur" ? settings.heroTitleUr : settings.heroTitleEn;
  const heroSub = lang === "ur" ? settings.heroSubtitleUr : settings.heroSubtitleEn;
  const announcement = lang === "ur" ? settings.announcementUr : settings.announcementEn;

  const trust = [
    { Icon: Leaf, label: t("trust_1") },
    { Icon: Truck, label: t("trust_2") },
    { Icon: MessageCircle, label: t("trust_3") },
    { Icon: BadgeCheck, label: t("trust_4") },
  ];

  return (
    <>
      {announcement && (
        <div className="bg-emerald-deep px-4 py-2 text-center text-sm text-primary-foreground">{announcement}</div>
      )}
      <section className="relative isolate overflow-hidden bg-cream">
        <img
          src={heroImg}
          alt=""
          width={1600}
          height={1104}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-veil absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-emerald-deep">
              <Leaf className="size-3.5" /> {t("tagline")}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-emerald-deep sm:text-5xl">
              {heroTitle || t("hero_title")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">{heroSub || t("hero_sub")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                search={{ q: undefined, cat: undefined }}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-95"
              >
                {t("hero_cta")}
              </Link>
              <a
                href={waLink("Assalam o Alaikum, I need advice from the Hakeem.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:border-primary"
              >
                {t("hero_cta2")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
          {trust.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="min-w-0">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold sm:text-2xl">{t("shop_by_cat")}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ cat: c.slug, q: undefined }}
              className="surface-panel group overflow-hidden text-center transition-shadow hover:shadow-lift"
            >
              <img
                src={c.image}
                alt={c.name[lang]}
                width={816}
                height={816}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="block px-2 py-3 text-sm font-medium">{c.name[lang]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold sm:text-2xl">{t("featured")}</h2>
          <Link
            to="/products"
            search={{ q: undefined, cat: undefined }}
            className="shrink-0 text-sm text-primary hover:underline"
          >
            {t("view_all")}
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="surface-panel flex flex-col items-start gap-4 bg-accent p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-accent-foreground">{t("consult_title")}</h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">{t("consult_d")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t("nav_contact")}
            </Link>
            <a
              href={waLink("Assalam o Alaikum, I want a consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium"
              dir="ltr"
            >
              {SHOP.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
