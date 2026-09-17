export type Settings = {
  whatsapp: string;
  phone: string;
  email: string;
  addressEn: string;
  addressUr: string;
  mapQuery: string;
  heroTitleEn: string;
  heroTitleUr: string;
  heroSubtitleEn: string;
  heroSubtitleUr: string;
  announcementEn: string;
  announcementUr: string;
};

export const defaultSettings: Settings = {
  whatsapp: "923072560758",
  phone: "+92 307 2560758",
  email: "salam@anmoldawakhana.pk",
  addressEn: "Shop 12, Herbal Market, Urdu Bazar, Lahore",
  addressUr: "دکان نمبر 12، ہربل مارکیٹ، اردو بازار، لاہور",
  mapQuery: "Urdu Bazar Lahore",
  heroTitleEn: "Pure Herbal Remedies & Authentic Tibbi Medicines",
  heroTitleUr: "خالص جڑی بوٹیوں سے تیار کردہ مستند ادویات",
  heroSubtitleEn: "Hand-prepared at Anmol Dawakhana with pure, tested ingredients.",
  heroSubtitleUr: "انمول دواخانہ میں خالص اور جانچے ہوئے اجزاء سے تیار کردہ۔",
  announcementEn: "",
  announcementUr: "",
};

/** Live shop details — kept in sync with the admin settings at runtime. */
export const SHOP = {
  ...defaultSettings,
  address: { en: defaultSettings.addressEn, ur: defaultSettings.addressUr },
  freeShippingOver: 2500,
  deliveryFee: 200,
};

export function applySettings(s: Settings) {
  Object.assign(SHOP, s);
  SHOP.address = { en: s.addressEn, ur: s.addressUr };
}

export function waLink(message: string) {
  const number = SHOP.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export type OrderLine = { name: string; price: string; qty: number };

/** The order message template used by every WhatsApp order button. */
export function orderMessage(lines: OrderLine[]) {
  const body = lines
    .map((l) => [`- Product: ${l.name}`, `- Price: ${l.price}`, `- Quantity: ${l.qty}`].join("\n"))
    .join("\n\n");

  return [
    "Salam! Main Anmol Dawakhana se yeh product order karna chahta/chahti hoon:",
    "",
    body,
    "",
    "Mera Naam: ",
    "Mera Address: ",
    "Mera Phone Number: ",
  ].join("\n");
}
