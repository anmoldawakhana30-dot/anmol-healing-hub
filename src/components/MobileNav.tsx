import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function MobileNav() {
  const { t } = useLang();
  const items = [
    { to: "/", label: t("nav_home"), Icon: Home, exact: true },
    { to: "/products", label: t("nav_categories"), Icon: LayoutGrid, exact: false },
    { to: "/contact", label: t("nav_contact"), Icon: Phone, exact: false },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-md">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
