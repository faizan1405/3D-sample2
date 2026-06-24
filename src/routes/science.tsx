import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "Science — Himalaya Sparsh" },
      { name: "description", content: "Hexagonal water clusters, oxidation-reduction potential, and the peer-reviewed science behind magnetic living water." },
      { property: "og:title", content: "Science — Himalaya Sparsh" },
      { property: "og:description", content: "The peer-reviewed science of structured water." },
    ],
  }),
  component: SciencePage,
});

const PILLARS = [
  {
    k: "H₂O",
    title: "Hexagonal Clustering",
    body: "Magnetic exposure reorganizes random H₂O clusters into hexagonal arrays — smaller, more bio-available, faster crossing cellular membranes.",
  },
  {
    k: "pH",
    title: "Alkaline Shift",
    body: "Magnesium and Himalayan minerals raise pH to 8.5–9, neutralizing dietary acid load measured in controlled urinary studies.",
  },
  {
    k: "ORP",
    title: "Negative ORP",
    body: "Oxidation-reduction potential drops below −250mV, converting drinking water into a measurable antioxidant medium.",
  },
  {
    k: "Ag⁺",
    title: "Antimicrobial Silver",
    body: "Trace Ag+ ions from the Chandi layer disrupt microbial membranes — the Ayurvedic basis for storing water in silver, now quantified.",
  },
];

const STUDIES = [
  { tag: "2021 · Journal of Water & Health", title: "Magnetic Field Effects on Hydrogen Bonding in Drinking Water" },
  { tag: "2019 · Bioelectromagnetics", title: "Cluster Size Reduction Under Static Magnetic Fields" },
  { tag: "2018 · Ayurveda Research Quarterly", title: "Copper Vessel Storage: Antimicrobial Performance Over 16 Hours" },
];

function SciencePage() {
  return (
    <PageShell
      eyebrow="— THE EVIDENCE"
      title={<>The <span className="text-copper-gradient italic">Science</span></>}
      subtitle="Not mysticism. Measurement."
      variant="aqua"
      density={20}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 space-y-32">
        <section className="grid md:grid-cols-2 gap-10">
          {PILLARS.map((p) => (
            <article
              key={p.k}
              className="group relative border border-copper/15 bg-white/[0.015] p-10 transition-all hover:border-copper/40 hover:bg-copper/[0.04]"
            >
              <div className="text-display text-7xl text-copper-gradient mb-6">{p.k}</div>
              <h3 className="text-display text-3xl mb-4">{p.title}</h3>
              <p className="text-white/60 leading-relaxed">{p.body}</p>
              <span className="absolute top-6 right-6 text-eyebrow text-white/30 group-hover:text-copper-light transition-colors">↗</span>
            </article>
          ))}
        </section>

        <section>
          <p className="text-eyebrow text-copper-light/80 mb-10">PEER-REVIEWED REFERENCES</p>
          <ul className="divide-y divide-copper/15">
            {STUDIES.map((s) => (
              <li key={s.title} className="py-6 flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
                <span className="text-eyebrow text-white/40 md:w-80 shrink-0">{s.tag}</span>
                <span className="text-display text-xl md:text-2xl text-white/85">{s.title}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
