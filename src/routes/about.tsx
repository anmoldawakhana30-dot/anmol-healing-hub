import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us & Our Hakeem — Anmol Dawakhana" },
      {
        name: "description",
        content: "Three generations of hakeems preparing pure herbal medicines with tested ingredients.",
      },
      { property: "og:title", content: "About Us & Our Hakeem — Anmol Dawakhana" },
      { property: "og:description", content: "Our heritage, our promise of purity, and the hakeem behind every remedy." },
    ],
  }),
  component: About,
});

function About() {
  const { t, lang } = useLang();

  const story = {
    en: "Anmol Dawakhana opened its first small counter in 1974. Three generations later we still grind, boil and fill every remedy by hand, in small batches, in our own clinic. Nothing leaves our shelf unless our hakeem has checked it himself.",
    ur: "انمول دواخانہ نے 1974 میں ایک چھوٹی سی دکان سے آغاز کیا۔ تین نسلوں کے بعد آج بھی ہر دوا اپنے دواخانے میں تھوڑی مقدار میں ہاتھ سے تیار کی جاتی ہے۔ کوئی دوا حکیم صاحب کی جانچ کے بغیر باہر نہیں جاتی۔",
  };

  const values = [
    {
      Icon: Leaf,
      title: { en: "Pure ingredients", ur: "خالص اجزاء" },
      text: {
        en: "Herbs sourced from trusted growers and cleaned before use.",
        ur: "جڑی بوٹیاں معتبر کاشتکاروں سے لی جاتی ہیں اور استعمال سے پہلے صاف کی جاتی ہیں۔",
      },
    },
    {
      Icon: ShieldCheck,
      title: { en: "Tested batches", ur: "جانچی ہوئی تیاری" },
      text: {
        en: "Every batch is checked for purity before packing.",
        ur: "ہر تیاری کو پیکنگ سے پہلے خالص پن کے لیے جانچا جاتا ہے۔",
      },
    },
    {
      Icon: HeartHandshake,
      title: { en: "Honest advice", ur: "دیانتدار مشورہ" },
      text: {
        en: "If a remedy is not right for you, our hakeem will say so.",
        ur: "اگر کوئی دوا آپ کے لیے مناسب نہ ہو تو حکیم صاحب صاف بتا دیں گے۔",
      },
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-emerald-deep sm:text-3xl">{t("about_title")}</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">{story[lang]}</p>

      <div className="surface-panel mt-8 grid overflow-hidden sm:grid-cols-[240px_1fr]">
        <img
          src={heroImg}
          alt={t("hakeem")}
          width={1600}
          height={1104}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover sm:h-full"
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold">{t("hakeem")}</h2>
          <p className="text-sm text-muted-foreground">{t("hakeem_role")}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {lang === "en"
              ? "Hakeem sahib learned the craft from his father and grandfather, and has been treating families in the same neighbourhood for over thirty years. He still sits at the clinic every evening to meet patients."
              : "حکیم صاحب نے یہ فن اپنے والد اور دادا سے سیکھا اور تیس سال سے زیادہ عرصے سے اسی محلے کے خاندانوں کا علاج کر رہے ہیں۔ آج بھی ہر شام مریضوں سے ملنے دواخانے میں تشریف رکھتے ہیں۔"}
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {t("hero_cta2")}
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {values.map(({ Icon, title, text }) => (
          <section key={title.en} className="surface-panel p-5">
            <Icon className="size-6 text-primary" />
            <h2 className="mt-3 font-semibold">{title[lang]}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text[lang]}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
