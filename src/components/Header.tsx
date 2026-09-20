import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/products", search: { q: q.trim() || undefined, cat: undefined } });
  }

  const navItems = [
    { to: "/", label: t("nav_home") },
    { to: "/products", label: t("nav_shop") },
    { to: "/about", label: t("nav_about") },
    { to: "/contact", label: t("nav_contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight text-emerald-deep">
              {t("brand")}
            </span>
            <span className="hidden truncate text-[11px] text-muted-foreground sm:block">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <form onSubmit={onSearch} className="relative hidden md:block">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_ph")}
              aria-label={t("search_ph")}
              className="h-10 w-48 rounded-full border border-border bg-card ps-9 pe-3 text-sm outline-none transition focus:w-60 focus:border-primary"
            />
          </form>

          <div className="flex overflow-hidden rounded-full border border-border bg-card p-0.5 text-xs">
            {(["en", "ur"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  l === "ur" && "font-urdu",
                )}
              >
                {l === "en" ? "EN" : "اردو"}
              </button>
            ))}
          </div>

        </div>
      </div>

      <form onSubmit={onSearch} className="border-t border-border px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_ph")}
            aria-label={t("search_ph")}
            className="h-10 w-full rounded-full border border-border bg-card ps-9 pe-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </form>
    </header>
  );
}
