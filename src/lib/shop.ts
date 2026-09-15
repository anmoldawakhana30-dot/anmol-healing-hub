// Placeholder business details — replace with the real ones.
export const SHOP = {
  whatsapp: "923001234567", // international format, no +
  phone: "+92 300 1234567",
  email: "salam@anmoldawakhana.pk",
  address: {
    en: "Shop 12, Herbal Market, Urdu Bazar, Lahore",
    ur: "دکان نمبر 12، ہربل مارکیٹ، اردو بازار، لاہور",
  },
  mapQuery: "Urdu Bazar Lahore",
  freeShippingOver: 2500,
  deliveryFee: 200,
};

export function waLink(message: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}
