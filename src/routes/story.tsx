import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Story — Himalaya Sparsh" },
      { name: "description", content: "The origin of Himalaya Sparsh — a journey from glacial silence to a living-water ritual hand-finished in copper." },
      { property: "og:title", content: "Story — Himalaya Sparsh" },
      { property: "og:description", content: "From glacier to artifact: the origin of the living-water revolution." },
    ],
  }),
  component: StoryPage,
});

const CHAPTERS = [
  {
    n: "I",
    title: "The Glacier",
    body: "It begins at 5,400 meters, where ice older than civilization breathes once a year. The water here is not poured — it is exhaled. We followed it down for nine months before we drew a single line.",
  },
  {
    n: "II",
    title: "The Vessel",
    body: "Copper was not chosen for beauty. It was chosen because the Vedas spoke of it, and because every ion that touches its inner wall is rewritten. The artifact is hand-spun by a single family in Moradabad — seven generations of hammered silence.",
  },
  {
    n: "III",
    title: "The Field",
    body: "Three magnetic poles in opposition. A field that reorders hydrogen clusters from chaos into hexagon. You do not taste this. You feel it, the way you feel a room go quiet.",
  },
  {
    n: "IV",
    title: "The Return",
    body: "Eight hours. Common water in. Living water out. The ritual is daily, the change is permanent. This is not a product. It is a relationship with the molecule.",
  },
];

function StoryPage() {
  return (
    <PageShell
      eyebrow="— CHAPTER ZERO · ORIGINS"
      title={<>The <span className="text-copper-gradient italic">Origin</span></>}
      subtitle="From a glacier no map names — to a vessel hand-finished in copper."
      variant="aqua"
      density={16}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-32 space-y-32">
        {CHAPTERS.map((c, i) => (
          <article
            key={c.n}
            className={`grid md:grid-cols-12 gap-8 items-start ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="md:col-span-4">
              <p className="text-eyebrow text-copper-light/80">CHAPTER {c.n}</p>
              <h2 className="text-display text-4xl md:text-5xl mt-3 leading-tight">{c.title}</h2>
            </div>
            <p className="md:col-span-8 text-white/65 text-lg md:text-xl leading-relaxed font-light">
              {c.body}
            </p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
