CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ur text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  old_price numeric,
  pack_en text NOT NULL DEFAULT '',
  pack_ur text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 5,
  reviews integer NOT NULL DEFAULT 0,
  popularity integer NOT NULL DEFAULT 50,
  image text NOT NULL DEFAULT 'tea',
  short_en text NOT NULL DEFAULT '',
  short_ur text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_ur text NOT NULL DEFAULT '',
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  dosage_en text NOT NULL DEFAULT '',
  dosage_ur text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.settings (
  id integer NOT NULL PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.settings TO anon;
GRANT SELECT ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly viewable" ON public.settings FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.settings (id, data) VALUES (1, jsonb_build_object(
  'whatsapp', '923072560758',
  'phone', '+92 307 2560758',
  'email', 'salam@anmoldawakhana.pk',
  'addressEn', 'Shop 12, Herbal Market, Urdu Bazar, Lahore',
  'addressUr', 'دکان نمبر 12، ہربل مارکیٹ، اردو بازار، لاہور',
  'mapQuery', 'Urdu Bazar Lahore',
  'heroTitleEn', 'Pure Herbal Remedies & Authentic Tibbi Medicines',
  'heroTitleUr', 'خالص جڑی بوٹیوں سے تیار کردہ مستند ادویات',
  'heroSubtitleEn', 'Hand-prepared at Anmol Dawakhana with pure, tested ingredients.',
  'heroSubtitleUr', 'انمول دواخانہ میں خالص اور جانچے ہوئے اجزاء سے تیار کردہ۔',
  'announcementEn', '',
  'announcementUr', ''
));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();