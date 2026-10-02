import { MessageCircle, Minus, Plus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { money, useLang } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { customerOrderMessage, waLink } from "@/lib/shop";
import { cn } from "@/lib/utils";

type Form = { name: string; address: string; phone: string };
type Errors = Partial<Record<keyof Form, string>>;

const copy = {
  title: { en: "Order via WhatsApp", ur: "واٹس ایپ پر آرڈر کریں" },
  description: {
    en: "Enter your delivery details. WhatsApp will open with your complete order ready to send.",
    ur: "اپنی معلومات لکھیں۔ آپ کا مکمل آرڈر واٹس ایپ میں تیار ہو جائے گا۔",
  },
  name: { en: "Full name", ur: "پورا نام" },
  address: { en: "Complete delivery address", ur: "مکمل پتہ" },
  phone: { en: "Phone number", ur: "فون نمبر" },
  quantity: { en: "Quantity", ur: "تعداد" },
  confirm: { en: "Confirm order", ur: "آرڈر کی تصدیق کریں" },
  required: { en: "Please enter this information.", ur: "براہ کرم یہ معلومات لکھیں۔" },
  invalidPhone: { en: "Enter a valid Pakistani mobile number.", ur: "پاکستان کا درست موبائل نمبر لکھیں۔" },
};

export function WhatsAppOrderDialog({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState<Form>({ name: "", address: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) setErrors({});
  }, [open]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const phone = form.phone.replace(/[\s-]/g, "");
    const next: Errors = {};
    if (form.name.trim().length < 3) next.name = copy.required[lang];
    if (form.address.trim().length < 10) next.address = copy.required[lang];
    if (!/^(?:\+?92|0)?3\d{9}$/.test(phone)) next.phone = copy.invalidPhone[lang];
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const message = customerOrderMessage({
      name: form.name.trim(),
      address: form.address.trim(),
      phone,
      quantity,
      productName: product.name[lang],
      pack: product.pack[lang],
      unitPrice: money(product.price, lang),
      total: money(product.price * quantity, lang),
    });
    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const field = "mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={cn("bg-whatsapp text-primary-foreground hover:bg-whatsapp/90", compact ? "h-9 px-3 text-xs" : "h-11 px-5")}
          aria-label={`${copy.title[lang]} — ${product.name[lang]}`}
        >
          <MessageCircle />
          {copy.title[lang]}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-md" dir={lang === "ur" ? "rtl" : "ltr"}>
        <DialogHeader className={lang === "ur" ? "text-right sm:text-right" : "text-left"}>
          <DialogTitle>{copy.title[lang]}</DialogTitle>
          <DialogDescription>{copy.description[lang]}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 border-y border-border py-3">
          <img src={product.image} alt="" className="size-14 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name[lang]}</p>
            <p className="text-xs text-muted-foreground">{product.pack[lang]}</p>
          </div>
          <p className="shrink-0 font-semibold text-emerald-deep">{money(product.price * quantity, lang)}</p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <label className="block text-sm font-medium">
            {copy.name[lang]}
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value.slice(0, 100) }))}
              className={field}
              autoComplete="name"
              maxLength={100}
            />
            {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
          </label>

          <label className="block text-sm font-medium">
            {copy.address[lang]}
            <textarea
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value.slice(0, 300) }))}
              className={field}
              rows={3}
              autoComplete="street-address"
              maxLength={300}
            />
            {errors.address && <span className="mt-1 block text-xs text-destructive">{errors.address}</span>}
          </label>

          <label className="block text-sm font-medium">
            {copy.phone[lang]}
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.slice(0, 18) }))}
              className={`${field} text-left`}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0300 1234567"
              dir="ltr"
              maxLength={18}
            />
            {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
          </label>

          <div>
            <span className="text-sm font-medium">{copy.quantity[lang]}</span>
            <div className="mt-1.5 flex h-11 w-36 items-center justify-between rounded-md border border-border bg-card p-1" dir="ltr">
              <Button type="button" variant="ghost" size="icon" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                <Minus />
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Increase quantity">
                <Plus />
              </Button>
            </div>
          </div>

          <Button type="submit" className="h-11 w-full bg-whatsapp text-primary-foreground hover:bg-whatsapp/90">
            <MessageCircle />
            {copy.confirm[lang]}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}