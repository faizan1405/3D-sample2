import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy — Himalaya Sparsh" },
      { name: "description", content: "Configure your Himalaya Sparsh — Copper Classic, Rose Gold, or Onyx Limited. Shipping worldwide." },
      { property: "og:title", content: "Buy — Himalaya Sparsh" },
      { property: "og:description", content: "Configure your living-water artifact." },
    ],
  }),
  component: BuyPage,
});

const VARIANTS = [
  { id: "copper", name: "Copper Classic", price: 24999, swatch: "linear-gradient(135deg,#f4c19a,#c97a4b,#7a3f25)", desc: "The original. Hand-finished copper, antique patina." },
  { id: "rose", name: "Rose Gold Edition", price: 32999, swatch: "linear-gradient(135deg,#f8d5c0,#d99a8a,#a8675a)", desc: "Limited annual run. Rose gold electroplate over copper core." },
  { id: "onyx", name: "Onyx Reserve", price: 39999, swatch: "linear-gradient(135deg,#3a3a3a,#0c0c0c,#000)", desc: "Black PVD finish. 100 units numbered worldwide." },
] as const;

function BuyPage() {
  const [variant, setVariant] = useState<typeof VARIANTS[number]["id"]>("copper");
  const [qty, setQty] = useState(1);
  const v = VARIANTS.find((x) => x.id === variant)!;
  const total = v.price * qty;

  return (
    <PageShell
      eyebrow="— ACQUIRE"
      title={<>Configure your <span className="text-copper-gradient italic">artifact</span></>}
      subtitle="Three finishes. One ritual. Shipping worldwide from Moradabad."
      variant="copper"
      density={10}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 grid md:grid-cols-2 gap-16 items-start">
        <div className="md:sticky md:top-32">
          <div
            className="aspect-[3/4] w-full rounded-sm border border-copper/20 transition-all duration-700"
            style={{ background: v.swatch }}
          />
          <p className="text-eyebrow text-white/40 mt-4 text-center">{v.name.toUpperCase()}</p>
        </div>

        <div className="space-y-10">
          <div>
            <p className="text-eyebrow text-copper-light/80 mb-3">FINISH</p>
            <div className="space-y-3">
              {VARIANTS.map((opt) => {
                const active = variant === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setVariant(opt.id)}
                    className={`w-full text-left flex items-center gap-5 p-5 border transition-all ${
                      active ? "border-copper bg-copper/5" : "border-copper/15 hover:border-copper/40"
                    }`}
                  >
                    <span className="h-10 w-10 rounded-full border border-white/10 shrink-0" style={{ background: opt.swatch }} />
                    <span className="flex-1">
                      <span className="block text-display text-xl">{opt.name}</span>
                      <span className="block text-white/50 text-sm mt-1">{opt.desc}</span>
                    </span>
                    <span className="text-display text-xl text-copper-light">₹{opt.price.toLocaleString("en-IN")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-eyebrow text-copper-light/80 mb-3">QUANTITY</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-12 w-12 border border-copper/30 hover:border-copper transition-colors text-xl"
              >
                −
              </button>
              <span className="text-display text-3xl tabular-nums w-12 text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(9, qty + 1))}
                className="h-12 w-12 border border-copper/30 hover:border-copper transition-colors text-xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-copper/20 pt-8 space-y-2">
            <div className="flex justify-between text-white/55">
              <span className="text-eyebrow">SUBTOTAL</span>
              <span className="text-display text-xl">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-white/55">
              <span className="text-eyebrow">SHIPPING</span>
              <span className="text-display text-xl text-copper-light">Complimentary</span>
            </div>
            <div className="flex justify-between items-baseline pt-4 border-t border-copper/10 mt-4">
              <span className="text-eyebrow text-white">TOTAL</span>
              <span className="text-display text-4xl text-copper-gradient">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            onClick={() => toast.success(`${qty} × ${v.name} reserved. A concierge will be in touch.`)}
            className="w-full bg-copper-gradient text-black text-eyebrow py-5 hover:opacity-90 transition-opacity"
          >
            Reserve Now
          </button>

          <p className="text-eyebrow text-white/40 text-center">
            Prefer to speak first?{" "}
            <Link to="/contact" className="text-copper-light hover:underline">Contact our concierge</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
