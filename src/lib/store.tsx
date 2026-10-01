import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import tea from "@/assets/cat-tea.jpg";
import oil from "@/assets/cat-oil.jpg";
import syrup from "@/assets/cat-syrup.jpg";
import { supabase } from "@/integrations/supabase/client";
import { products as defaultProducts, type Bi, type Product } from "./products";
import { applySettings, defaultSettings, type Settings } from "./shop";

const presets: Record<string, string> = { tea, oil, syrup };

export function resolveImage(value: string) {
  if (!value) return tea;
  if (presets[value]) return presets[value] as string;
  if (/^(https?:|data:|\/)/.test(value)) return value;
  return tea;
}

type Row = {
  slug: string;
  name_en: string;
  name_ur: string;
  category: string;
  price: number;
  old_price: number | null;
  pack_en: string;
  pack_ur: string;
  rating: number;
  reviews: number;
  popularity: number;
  image: string;
  short_en: string;
  short_ur: string;
  description_en: string;
  description_ur: string;
  benefits: unknown;
  ingredients: unknown;
  dosage_en: string;
  dosage_ur: string;
};

function biList(value: unknown): Bi[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x): x is Bi => !!x && typeof x === "object" && "en" in x)
    .map((x) => ({ en: String(x.en ?? ""), ur: String(x.ur ?? "") }));
}

export function rowToProduct(r: Row): Product & { rawImage: string } {
  return {
    slug: r.slug,
    name: { en: r.name_en, ur: r.name_ur },
    category: r.category,
    price: Number(r.price),
    ...(r.old_price != null ? { oldPrice: Number(r.old_price) } : {}),
    pack: { en: r.pack_en, ur: r.pack_ur },
    rating: Number(r.rating),
    reviews: r.reviews,
    popularity: r.popularity,
    image: resolveImage(r.image),
    rawImage: r.image,
    short: { en: r.short_en, ur: r.short_ur },
    description: { en: r.description_en, ur: r.description_ur },
    benefits: biList(r.benefits),
    ingredients: biList(r.ingredients),
    dosage: { en: r.dosage_en, ur: r.dosage_ur },
  };
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("popularity", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(rowToProduct);
}

export async function fetchSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw error;
  return { ...defaultSettings, ...((data?.data as Partial<Settings> | undefined) ?? {}) };
}

type Ctx = {
  products: Product[];
  settings: Settings;
  getProduct: (slug: string) => Product | undefined;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 60_000 });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: fetchSettings, staleTime: 60_000 });

  const products = productsQuery.data ?? (productsQuery.isError ? [] : defaultProducts);
  const settings = settingsQuery.data ?? defaultSettings;
  applySettings(settings);

  const value = useMemo<Ctx>(
    () => ({ products, settings, getProduct: (slug) => products.find((p) => p.slug === slug) }),
    [products, settings],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
