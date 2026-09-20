import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Anmol Dawakhana" },
      { name: "description", content: "Review the herbal medicines in your cart before checkout." },
      { property: "og:title", content: "Your Cart — Anmol Dawakhana" },
      { property: "og:description", content: "Review your herbal medicine order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/products", search: { q: undefined, cat: undefined } });
  },
  component: () => null,
});
