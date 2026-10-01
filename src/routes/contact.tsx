import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { SHOP, waLink } from "@/lib/shop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Online Consultation — Anmol Dawakhana" },
      {
        name: "description",
        content: "Visit our clinic, call us, or send your health question to our hakeem for a free online consultation.",
      },
      { property: "og:title", content: "Contact & Online Consultation — Anmol Dawakhana" },
      { property: "og:description", content: "Talk to our hakeem by phone, WhatsApp or the online consultation form." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t, lang } = useLang();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", problem: "" });

  const field =
    "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 3 || form.phone.trim().length < 10 || form.problem.trim().length < 10) {
      toast.error(t("required"));
      return;
    }
    setSent(true);
    toast.success(t("sent"));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-emerald-deep sm:text-3xl">{t("contact_title")}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface-panel p-5">
          <h2 className="font-semibold">{t("consult_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("consult_d")}</p>

          {sent ? (
            <p className="mt-6 rounded-xl bg-accent p-4 text-sm text-accent-foreground">{t("sent")}</p>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="cname">
                  {t("full_name")}
                </label>
                <input
                  id="cname"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={field}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="cphone">
                  {t("phone")}
                </label>
                <input
                  id="cphone"
                  dir="ltr"
                  inputMode="tel"
                  placeholder="03001234567"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={field}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="cprob">
                  {t("your_problem")}
                </label>
                <textarea
                  id="cprob"
                  rows={4}
                  value={form.problem}
                  onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
                  className={field}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground"
              >
                {t("send")}
              </button>
              <a
                href={waLink("Assalam o Alaikum, I need a consultation from the Hakeem.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-sm font-medium text-primary-foreground"
              >
                <MessageCircle className="size-4" /> {t("trust_3")}
              </a>
            </form>
          )}
        </section>

        <section className="space-y-4">
          <div className="surface-panel space-y-3 p-5 text-sm">
            <h2 className="font-semibold">{t("visit")}</h2>
            <p className="flex gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {SHOP.address[lang]}
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span dir="ltr">{SHOP.phone}</span>
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span dir="ltr">{SHOP.email}</span>
            </p>
            <p className="flex gap-2 text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              {t("hours")}
            </p>
          </div>

          <div className="surface-panel overflow-hidden">
            <iframe
              title="Anmol Dawakhana location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&output=embed`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
