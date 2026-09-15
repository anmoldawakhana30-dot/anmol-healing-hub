import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/shop";

export function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="mt-16 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            <span className="font-semibold text-emerald-deep">{t("brand")}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <div className="text-sm">
          <h2 className="font-medium">{t("nav_shop")}</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-primary">
                {t("view_all")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                {t("nav_about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                {t("nav_contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          <h2 className="font-medium text-foreground">{t("visit")}</h2>
          <p className="mt-3">{SHOP.address[lang]}</p>
          <p className="mt-1" dir="ltr">
            {SHOP.phone}
          </p>
          <p className="mt-1">{t("hours")}</p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        {t("disclaimer")}
      </div>
    </footer>
  );
}
