import tea from "@/assets/cat-tea.jpg";
import oil from "@/assets/cat-oil.jpg";
import syrup from "@/assets/cat-syrup.jpg";

export type Bi = { en: string; ur: string };

export type Category = { slug: string; name: Bi; image: string };

export const categories: Category[] = [
  { slug: "herbal-teas", name: { en: "Herbal Teas", ur: "جوشاندے / چائے" }, image: tea },
  { slug: "oils", name: { en: "Essential Oils", ur: "روغنیات" }, image: oil },
  { slug: "immunity", name: { en: "Immunity Boosters", ur: "بیماری سے بچاؤ" }, image: tea },
  { slug: "syrups", name: { en: "Tonics & Syrups", ur: "شربت" }, image: syrup },
  { slug: "wellness", name: { en: "General Wellness", ur: "معجون اور سفوف" }, image: syrup },
];

export type Product = {
  slug: string;
  name: Bi;
  category: string;
  price: number;
  oldPrice?: number;
  pack: Bi;
  rating: number;
  reviews: number;
  popularity: number;
  image: string;
  short: Bi;
  description: Bi;
  benefits: Bi[];
  ingredients: Bi[];
  dosage: Bi;
};

const b = (en: string, ur: string): Bi => ({ en, ur });

export const products: Product[] = [
  {
    slug: "joshanda-special",
    name: b("Special Joshanda Tea", "خاص جوشاندہ"),
    category: "herbal-teas",
    price: 450,
    oldPrice: 550,
    pack: b("200 g", "200 گرام"),
    rating: 4.8,
    reviews: 214,
    popularity: 98,
    image: tea,
    short: b("Warm relief for cough and cold.", "کھانسی اور زکام میں آرام۔"),
    description: b(
      "A gentle daily tea made from nine dried herbs. Boil a spoon in water, strain, and sip warm for comfort in cough, sore throat and seasonal cold.",
      "نو جڑی بوٹیوں سے تیار کردہ سادہ چائے۔ ایک چمچ پانی میں ابال کر چھان لیں اور نیم گرم پئیں۔ کھانسی، گلے کی خراش اور موسمی زکام میں آرام دیتی ہے۔",
    ),
    benefits: [
      b("Soothes throat and chest", "گلے اور سینے کو آرام"),
      b("Helps clear blocked nose", "بند ناک کھولنے میں مدد"),
      b("Warms the body in winter", "سردی میں جسم کو گرم رکھے"),
    ],
    ingredients: [
      b("Adusa leaves", "برگِ اڑوسہ"),
      b("Liquorice root", "ملٹھی"),
      b("Fennel", "سونف"),
      b("Black pepper", "کالی مرچ"),
    ],
    dosage: b(
      "One teaspoon in a cup of water. Boil 3 minutes, strain, drink twice a day.",
      "ایک چائے کا چمچ ایک کپ پانی میں تین منٹ ابالیں، چھان کر دن میں دو بار پئیں۔",
    ),
  },
  {
    slug: "sharbat-e-sandal",
    name: b("Sharbat-e-Sandal", "شربتِ صندل"),
    category: "syrups",
    price: 620,
    pack: b("300 ml", "300 ملی لیٹر"),
    rating: 4.7,
    reviews: 132,
    popularity: 90,
    image: syrup,
    short: b("Cooling syrup for summer heat.", "گرمی کے لیے ٹھنڈا شربت۔"),
    description: b(
      "A classic cooling syrup of sandalwood and rose. Mix with chilled water to calm summer heat, burning feet and restlessness.",
      "صندل اور گلاب سے تیار روایتی ٹھنڈا شربت۔ ٹھنڈے پانی میں ملا کر پئیں، گرمی، پاؤں کی جلن اور بے چینی میں مفید۔",
    ),
    benefits: [
      b("Cools the body", "جسم کو ٹھنڈک"),
      b("Refreshes in hot weather", "گرمی میں تازگی"),
      b("Helps calm restlessness", "بے چینی میں سکون"),
    ],
    ingredients: [b("Sandalwood", "صندل سفید"), b("Rose petals", "گلاب"), b("Cane sugar", "قند")],
    dosage: b("Two spoons in a glass of cold water, once daily.", "دو چمچ ایک گلاس ٹھنڈے پانی میں، دن میں ایک بار۔"),
  },
  {
    slug: "roghan-badam",
    name: b("Pure Almond Oil", "روغنِ بادام شیریں"),
    category: "oils",
    price: 890,
    pack: b("100 ml", "100 ملی لیٹر"),
    rating: 4.9,
    reviews: 305,
    popularity: 96,
    image: oil,
     short: b("Cold-pressed oil for hair and memory.", "بالوں اور یادداشت کے لیے خالص بادام کا تیل۔"),
    description: b(
      "Cold-pressed sweet almond oil, nothing added. Massage into hair and skin, or take a few drops with warm milk.",
       "بغیر ملاوٹ کا خالص بادام کا تیل۔ بالوں اور جلد پر مالش کریں یا چند قطرے نیم گرم دودھ کے ساتھ لیں۔",
    ),
    benefits: [
      b("Nourishes hair and scalp", "بالوں کی غذائیت"),
      b("Softens dry skin", "خشک جلد نرم کرے"),
      b("Supports memory", "یادداشت میں مدد"),
    ],
    ingredients: [b("100% sweet almond oil", "سو فیصد روغنِ بادام شیریں")],
    dosage: b("5 drops with warm milk at night, or massage as needed.", "رات کو 5 قطرے نیم گرم دودھ میں، یا حسبِ ضرورت مالش۔"),
  },
  {
    slug: "immunity-majoon",
    name: b("Daily Immunity Majoon", "معجونِ قوتِ مدافعت"),
    category: "immunity",
    price: 1250,
    oldPrice: 1450,
    pack: b("500 g", "500 گرام"),
    rating: 4.6,
    reviews: 178,
    popularity: 94,
    image: syrup,
    short: b("Honey-based paste for daily strength.", "روزانہ طاقت کے لیے شہد والا معجون۔"),
    description: b(
      "A honey and herb paste taken every morning to keep the body strong through changing seasons.",
      "شہد اور جڑی بوٹیوں سے تیار معجون، ہر صبح استعمال کریں تاکہ بدلتے موسم میں جسم مضبوط رہے۔",
    ),
    benefits: [
      b("Builds daily strength", "روزانہ طاقت"),
      b("Supports the immune system", "قوتِ مدافعت میں اضافہ"),
      b("Good for weakness after illness", "بیماری کے بعد کمزوری میں مفید"),
    ],
    ingredients: [b("Pure honey", "خالص شہد"), b("Amla", "آملہ"), b("Ginger", "سونٹھ"), b("Almonds", "بادام")],
    dosage: b("One teaspoon every morning with milk.", "روزانہ صبح ایک چمچ دودھ کے ساتھ۔"),
  },
  {
    slug: "safoof-e-hazm",
    name: b("Digestion Powder", "سفوفِ ہضم"),
    category: "wellness",
    price: 380,
    pack: b("150 g", "150 گرام"),
    rating: 4.5,
    reviews: 96,
    popularity: 85,
    image: tea,
    short: b("After-meal powder for heavy stomach.", "کھانے کے بعد بھاری پن کے لیے سفوف۔"),
    description: b(
      "A simple powder of digestive seeds and salts. Take after heavy meals for gas, bloating and heaviness.",
      "ہاضمے کے بیجوں اور نمکیات سے تیار سادہ سفوف۔ بھاری کھانے کے بعد گیس، پھولن اور بوجھ میں استعمال کریں۔",
    ),
    benefits: [
      b("Eases gas and bloating", "گیس اور پھولن میں آرام"),
      b("Helps digest heavy food", "بھاری کھانا ہضم کرے"),
      b("Freshens the mouth", "منہ کی تازگی"),
    ],
    ingredients: [b("Ajwain", "اجوائن"), b("Black salt", "کالا نمک"), b("Fennel", "سونف")],
    dosage: b("Half teaspoon with warm water after meals.", "کھانے کے بعد آدھا چمچ نیم گرم پانی سے۔"),
  },
  {
    slug: "roghan-zaitoon",
    name: b("Olive Oil (Roghan Zaitoon)", "روغنِ زیتون"),
    category: "oils",
    price: 760,
    pack: b("120 ml", "120 ملی لیٹر"),
    rating: 4.7,
    reviews: 141,
    popularity: 88,
    image: oil,
    short: b("For joints, hair and daily massage.", "جوڑوں، بالوں اور مالش کے لیے۔"),
    description: b(
      "Traditional olive oil for body massage, joint comfort and hair care.",
      "روایتی روغنِ زیتون، جسم کی مالش، جوڑوں کے آرام اور بالوں کی حفاظت کے لیے۔",
    ),
    benefits: [
      b("Comforts stiff joints", "اکڑے جوڑوں میں آرام"),
      b("Strengthens hair roots", "بالوں کی جڑیں مضبوط"),
      b("Moisturises dry skin", "خشک جلد کو نمی"),
    ],
    ingredients: [b("Pure olive oil", "خالص روغنِ زیتون")],
    dosage: b("Massage gently on the affected area twice a day.", "متاثرہ جگہ پر دن میں دو بار ہلکی مالش کریں۔"),
  },
  {
    slug: "sharbat-faulad",
    name: b("Iron Tonic Syrup", "شربتِ فولاد"),
    category: "syrups",
    price: 690,
    pack: b("250 ml", "250 ملی لیٹر"),
    rating: 4.4,
    reviews: 74,
    popularity: 80,
    image: syrup,
    short: b("Herbal support for weakness and low blood.", "کمزوری اور خون کی کمی میں مددگار۔"),
    description: b(
      "A herbal iron tonic to support energy levels and help with tiredness and pale skin.",
      "جڑی بوٹیوں سے تیار فولادی شربت، توانائی بڑھانے اور تھکن و زردی میں مدد کے لیے۔",
    ),
    benefits: [
      b("Supports blood strength", "خون کی طاقت"),
      b("Reduces daily tiredness", "تھکن میں کمی"),
      b("Good for growing children", "بڑھتے بچوں کے لیے مفید"),
    ],
    ingredients: [b("Amla", "آملہ"), b("Beetroot extract", "چقندر"), b("Jaggery", "گڑ")],
    dosage: b("Two spoons after breakfast and dinner.", "ناشتے اور رات کے کھانے کے بعد دو چمچ۔"),
  },
  {
    slug: "kehwa-green",
    name: b("Kashmiri Kehwa", "کشمیری قہوہ"),
    category: "herbal-teas",
    price: 540,
    pack: b("250 g", "250 گرام"),
    rating: 4.8,
    reviews: 189,
    popularity: 92,
    image: tea,
    short: b("Light green tea with cardamom and saffron.", "الائچی اور زعفران والا ہلکا قہوہ۔"),
    description: b(
      "A light, fragrant tea to drink after meals. Helps digestion and feels calming in the evening.",
      "کھانے کے بعد پینے کے لیے ہلکا خوشبودار قہوہ۔ ہاضمے میں مدد اور شام کو سکون دیتا ہے۔",
    ),
    benefits: [
      b("Light on the stomach", "معدے پر ہلکا"),
      b("Helps after heavy meals", "بھاری کھانے کے بعد مفید"),
      b("Calming aroma", "سکون بخش خوشبو"),
    ],
    ingredients: [b("Green tea", "سبز چائے"), b("Cardamom", "الائچی"), b("Saffron", "زعفران")],
    dosage: b("One cup after lunch or dinner.", "دوپہر یا رات کے کھانے کے بعد ایک کپ۔"),
  },
  {
    slug: "kalonji-capsules",
    name: b("Kalonji Immunity Capsules", "کلونجی کیپسول"),
    category: "immunity",
    price: 980,
    pack: b("60 capsules", "60 کیپسول"),
    rating: 4.6,
    reviews: 122,
    popularity: 87,
    image: oil,
    short: b("Black seed oil in easy capsules.", "کلونجی کا تیل آسان کیپسول میں۔"),
    description: b(
      "Cold-pressed black seed oil filled into soft capsules for people who do not like the taste of oil.",
      "کولڈ پریسڈ کلونجی کا تیل نرم کیپسول میں، ان لوگوں کے لیے جنہیں تیل کا ذائقہ پسند نہیں۔",
    ),
    benefits: [
      b("Daily immunity support", "روزانہ قوتِ مدافعت"),
      b("Easy to take", "استعمال میں آسان"),
      b("No oily taste", "تیل کا ذائقہ نہیں"),
    ],
    ingredients: [b("Black seed (kalonji) oil", "روغنِ کلونجی")],
    dosage: b("One capsule after breakfast daily.", "روزانہ ناشتے کے بعد ایک کیپسول۔"),
  },
  {
    slug: "sleep-tea",
    name: b("Calm Night Tea", "سکون آور قہوہ"),
    category: "wellness",
    price: 430,
    pack: b("120 g", "120 گرام"),
    rating: 4.5,
    reviews: 68,
    popularity: 78,
    image: tea,
    short: b("Gentle evening tea for restful sleep.", "پرسکون نیند کے لیے شام کی چائے۔"),
    description: b(
      "Chamomile, lavender and mint blend to help you wind down before bed.",
      "بابونہ، لیوینڈر اور پودینے کا امتزاج، سونے سے پہلے سکون کے لیے۔",
    ),
    benefits: [
      b("Helps you relax", "سکون میں مدد"),
      b("Caffeine free", "کیفین سے پاک"),
      b("Soothing before bed", "سونے سے پہلے آرام دہ"),
    ],
    ingredients: [b("Chamomile", "بابونہ"), b("Lavender", "لیوینڈر"), b("Mint", "پودینہ")],
    dosage: b("One cup 30 minutes before sleeping.", "سونے سے آدھا گھنٹہ پہلے ایک کپ۔"),
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
