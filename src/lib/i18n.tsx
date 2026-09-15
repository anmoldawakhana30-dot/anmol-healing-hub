import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ur";

type Dict = Record<string, { en: string; ur: string }>;

export const dict: Dict = {
  brand: { en: "Anmol Dawakhana", ur: "انمول دواخانہ" },
  tagline: { en: "Pure herbal remedies since 1974", ur: "خالص جڑی بوٹیوں کی ادویات، 1974 سے" },
  nav_home: { en: "Home", ur: "ہوم" },
  nav_shop: { en: "Products", ur: "ادویات" },
  nav_about: { en: "About", ur: "ہمارا تعارف" },
  nav_contact: { en: "Contact", ur: "رابطہ" },
  nav_cart: { en: "Cart", ur: "ٹوکری" },
  nav_categories: { en: "Categories", ur: "اقسام" },
  search_ph: { en: "Search medicines...", ur: "دوا تلاش کریں..." },
  hero_title: {
    en: "Pure Herbal Remedies & Authentic Tibbi Medicines",
    ur: "خالص جڑی بوٹیوں سے تیار کردہ مستند طبی ادویات",
  },
  hero_sub: {
    en: "Hand-prepared by our hakeems from clean, tested herbs. No fillers, no shortcuts.",
    ur: "ہمارے حکیم صاحبان صاف اور جانچی ہوئی جڑی بوٹیوں سے خود تیار کرتے ہیں۔ کوئی ملاوٹ نہیں۔",
  },
  hero_cta: { en: "Shop medicines", ur: "ادویات دیکھیں" },
  hero_cta2: { en: "Talk to a Hakeem", ur: "حکیم سے رابطہ" },
  trust_1: { en: "100% natural herbs", ur: "سو فیصد قدرتی اجزاء" },
  trust_2: { en: "Cash on delivery", ur: "ڈیلیوری پر ادائیگی" },
  trust_3: { en: "Order on WhatsApp", ur: "واٹس ایپ پر آرڈر" },
  trust_4: { en: "Delivery all over Pakistan", ur: "پورے پاکستان میں ڈیلیوری" },
  shop_by_cat: { en: "Shop by category", ur: "اقسام کے مطابق خریدیں" },
  featured: { en: "Popular medicines", ur: "مقبول ادویات" },
  view_all: { en: "View all", ur: "سب دیکھیں" },
  add_to_cart: { en: "Add to cart", ur: "ٹوکری میں ڈالیں" },
  buy_now: { en: "Buy now", ur: "ابھی خریدیں" },
  added: { en: "Added to cart", ur: "ٹوکری میں شامل ہو گیا" },
  all: { en: "All", ur: "تمام" },
  sort: { en: "Sort", ur: "ترتیب" },
  sort_popular: { en: "Most popular", ur: "مقبول ترین" },
  sort_low: { en: "Price: low to high", ur: "قیمت: کم سے زیادہ" },
  sort_high: { en: "Price: high to low", ur: "قیمت: زیادہ سے کم" },
  no_results: { en: "No medicines found.", ur: "کوئی دوا نہیں ملی۔" },
  benefits: { en: "Health benefits", ur: "فوائد" },
  ingredients: { en: "Key ingredients", ur: "بنیادی اجزاء" },
  dosage: { en: "How to use", ur: "طریقہ استعمال" },
  reviews: { en: "Customer reviews", ur: "گاہکوں کی رائے" },
  pack: { en: "Pack size", ur: "وزن / پیکنگ" },
  cart_title: { en: "Your cart", ur: "آپ کی ٹوکری" },
  cart_empty: { en: "Your cart is empty.", ur: "آپ کی ٹوکری خالی ہے۔" },
  continue_shopping: { en: "Continue shopping", ur: "خریداری جاری رکھیں" },
  subtotal: { en: "Subtotal", ur: "کل رقم" },
  delivery: { en: "Delivery", ur: "ڈیلیوری" },
  free: { en: "Free", ur: "مفت" },
  total: { en: "Total", ur: "مجموعی رقم" },
  checkout: { en: "Checkout", ur: "آرڈر مکمل کریں" },
  remove: { en: "Remove", ur: "ہٹائیں" },
  checkout_title: { en: "Checkout", ur: "آرڈر مکمل کریں" },
  guest_note: { en: "No account needed — just your address.", ur: "اکاؤنٹ بنانے کی ضرورت نہیں، صرف پتہ لکھیں۔" },
  full_name: { en: "Full name", ur: "پورا نام" },
  phone: { en: "Mobile number", ur: "موبائل نمبر" },
  phone_hint: { en: "We call this number to confirm your order.", ur: "ہم اسی نمبر پر آرڈر کی تصدیق کریں گے۔" },
  address: { en: "Complete address", ur: "مکمل پتہ" },
  city: { en: "City", ur: "شہر" },
  notes: { en: "Note for us (optional)", ur: "کوئی ہدایت (اختیاری)" },
  payment: { en: "Payment method", ur: "ادائیگی کا طریقہ" },
  cod: { en: "Cash on Delivery", ur: "ڈیلیوری پر نقد ادائیگی" },
  cod_d: { en: "Pay the rider when your parcel arrives.", ur: "پارسل ملنے پر رائیڈر کو ادائیگی کریں۔" },
  online: { en: "Online payment", ur: "آن لائن ادائیگی" },
  online_d: { en: "Card, bank transfer or wallet.", ur: "کارڈ، بینک ٹرانسفر یا والٹ۔" },
  place_order: { en: "Place order", ur: "آرڈر دیں" },
  wa_order: { en: "Order on WhatsApp", ur: "واٹس ایپ پر آرڈر کریں" },
  order_summary: { en: "Order summary", ur: "آرڈر کی تفصیل" },
  order_done: { en: "Order received!", ur: "آرڈر موصول ہو گیا!" },
  order_done_d: {
    en: "We will call you shortly to confirm.",
    ur: "ہم جلد تصدیق کے لیے آپ کو کال کریں گے۔",
  },
  required: { en: "Please fill this field correctly.", ur: "براہِ کرم یہ خانہ درست بھریں۔" },
  about_title: { en: "About Anmol Dawakhana", ur: "انمول دواخانہ کا تعارف" },
  hakeem: { en: "Hakeem Abdul Rahman", ur: "حکیم عبدالرحمٰن" },
  hakeem_role: { en: "Chief Hakeem, third generation", ur: "چیف حکیم، تیسری نسل" },
  contact_title: { en: "Contact & Consultation", ur: "رابطہ اور مشورہ" },
  consult_title: { en: "Online consultation", ur: "آن لائن مشورہ" },
  consult_d: {
    en: "Tell us your problem in simple words. Our hakeem replies within 24 hours.",
    ur: "اپنی تکلیف آسان الفاظ میں لکھیں۔ ہمارے حکیم صاحب 24 گھنٹے میں جواب دیں گے۔",
  },
  your_problem: { en: "Your problem", ur: "آپ کی تکلیف" },
  send: { en: "Send message", ur: "پیغام بھیجیں" },
  sent: { en: "Message sent. We will contact you soon.", ur: "پیغام بھیج دیا گیا۔ ہم جلد رابطہ کریں گے۔" },
  visit: { en: "Visit our clinic", ur: "دواخانہ تشریف لائیں" },
  hours: { en: "Open daily 9:00 AM – 9:00 PM", ur: "روزانہ صبح 9 تا رات 9 بجے" },
  rs: { en: "Rs", ur: "روپے" },
  qty: { en: "Qty", ur: "تعداد" },
  disclaimer: {
    en: "Herbal products support wellness; they do not replace a doctor's advice.",
    ur: "جڑی بوٹیوں کی ادویات صحت میں مددگار ہیں، یہ ڈاکٹری مشورے کا متبادل نہیں۔",
  },
};

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; setLang: (l: Lang) => void; t: (k: keyof typeof dict | string) => string };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ad_lang");
    if (saved === "ur" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("ad_lang", l);
  }, []);

  const t = useCallback((k: string) => dict[k]?.[lang] ?? k, [lang]);

  const value = useMemo<Ctx>(
    () => ({ lang, dir: lang === "ur" ? "rtl" : "ltr", setLang, t }),
    [lang, setLang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

export function pick(v: { en: string; ur: string }, lang: Lang) {
  return v[lang];
}

export function money(n: number) {
  return "Rs " + n.toLocaleString("en-PK");
}
