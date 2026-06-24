import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology — Himalaya Sparsh" },
      { name: "description", content: "Nine engineered layers, triple-magnetic core, Korean bio-ceramics — the architecture inside Himalaya Sparsh." },
      { property: "og:title", content: "Technology — Himalaya Sparsh" },
      { property: "og:description", content: "Nine layers. One ritual. The architecture of living water." },
    ],
  }),
  component: TechPage,
});

const LAYERS = [
  { name: "Copper Intake Funnel", spec: "99.9% pure copper · hand-spun" },
  { name: "Himalayan Mineral Stones", spec: "8 trace minerals · alkalinizing" },
  { name: "Japanese Energy Stones", spec: "tourmaline · far-infrared emission" },
  { name: "Silver Chandi Infusion", spec: "antimicrobial Ag+ ion release" },
  { name: "Jamun Wood Filter", spec: "antibiotic · pH stabilizing" },
  { name: "Magnesium Core", spec: "ionic exchange · hydrogen rich" },
  { name: "Korean Bio-Ceramic Media", spec: "far-IR · structured water clusters" },
  { name: "Triple Magnetic Layer", spec: "3 × 12,000 gauss · opposing poles" },
  { name: "Zinc · Potassium Finish", spec: "electrolyte balance · taste polish" },
];

function TechPage() {
  return (
    <PageShell
      eyebrow="— THE ARCHITECTURE"
      title={<>Nine Layers, <span className="text-copper-gradient italic">One Ritual</span></>}
      subtitle="Every layer is a deliberate intervention on the molecule."
      variant="copper"
      density={12}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-32">
        <p className="text-eyebrow text-copper-light/80 mb-10">CROSS-SECTION</p>
        <ol className="divide-y divide-copper/15">
          {LAYERS.map((l, i) => (
            <li
              key={l.name}
              className="group grid grid-cols-12 gap-6 py-8 items-baseline transition-all hover:bg-copper/[0.03] px-4 -mx-4 rounded-sm"
            >
              <span className="col-span-1 text-eyebrow text-copper-light/70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="col-span-6 text-display text-2xl md:text-3xl text-white">{l.name}</h3>
              <p className="col-span-5 text-white/55 text-sm md:text-base text-right font-mono tracking-wide">
                {l.spec}
              </p>
            </li>
          ))}
        </ol>

        <section className="mt-32 grid md:grid-cols-3 gap-10 border-t border-copper/15 pt-16">
          {[
            { v: "8.5–9", l: "alkaline pH" },
            { v: "73+", l: "trace minerals" },
            { v: "−250mV", l: "ORP antioxidant" },
          ].map((m) => (
            <div key={m.l} className="border-l border-copper/40 pl-5">
              <div className="text-display text-5xl md:text-6xl text-copper-gradient">{m.v}</div>
              <div className="text-eyebrow text-white/55 mt-3">{m.l}</div>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
