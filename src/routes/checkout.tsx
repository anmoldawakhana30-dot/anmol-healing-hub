import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Order via WhatsApp — Anmol Dawakhana" },
      { name: "description", content: "Choose a herbal product and order directly through WhatsApp." },
      { property: "og:title", content: "Order via WhatsApp — Anmol Dawakhana" },
      { property: "og:description", content: "Choose a herbal product and order directly through WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/products", search: { q: undefined, cat: undefined } });
  },
  component: () => null,
});