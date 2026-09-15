import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Phone, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

export function MobileNav() {
  const { t } = useLang();
  const { count } = useCart();

  const items = [
    { to: "/", label: t("nav_home"), Icon: Home, exact: true },
    { to: "/products", label: t("nav_categories"), Icon: LayoutGrid, exact: false },
    { to: "/cart", label: t("nav_cart"), Icon: ShoppingBag, exact: false },
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
              <span className="relative">
                <Icon className="size-5" />
                {to === "/cart" && count > 0 && (
                  <span className="absolute -top-1.5 -end-2 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
