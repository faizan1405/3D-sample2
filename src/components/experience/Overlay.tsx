import { useEffect, useState, type MutableRefObject } from "react";
import logoUrl from "@/assets/himalaya-logo.png";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// fade in/out around a range
const band = (p: number, a: number, b: number, fade = 0.04) => {
  const inT = seg(p, a, a + fade);
  const outT = 1 - seg(p, b - fade, b);
  return Math.min(inT, outT);
};

interface Props {
  scrollRef: MutableRefObject<number>;
}

export function Overlay({ scrollRef }: Props) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setP(scrollRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Top nav */}
      <header className="pointer-events-auto absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 md:px-14">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Himalaya Sparsh" className="h-10 w-auto opacity-95" />
        </div>
        <nav className="hidden md:flex items-center gap-10 text-eyebrow text-white/70">
          <a href="#story" className="hover:text-copper-light transition-colors">Story</a>
          <a href="#technology" className="hover:text-copper-light transition-colors">Technology</a>
          <a href="#science" className="hover:text-copper-light transition-colors">Science</a>
          <a href="#buy" className="hover:text-copper-light transition-colors">Buy</a>
        </nav>
        <a
          href="#buy"
          className="text-eyebrow border border-copper/50 px-5 py-2.5 text-white/90 hover:bg-copper hover:text-black transition-all"
        >
          Reserve
        </a>
      </header>

      {/* Scene 1 — Hero */}
      <SceneCard opacity={band(p, 0, 0.12, 0.04)} align="center">
        <p className="text-eyebrow text-copper-light/80 mb-6 animate-shimmer">— EST. MMXXVI · HIMALAYA</p>
        <h1 className="text-display text-5xl md:text-8xl text-white leading-[0.95]">
          Himalaya <span className="text-copper-gradient italic">Sparsh</span>
        </h1>
        <p className="text-display text-xl md:text-2xl text-white/60 mt-6 italic">The Living Water Revolution</p>
        <div className="mt-12 pointer-events-auto">
          <a href="#buy" className="inline-flex items-center gap-3 text-eyebrow text-white border border-copper/40 px-8 py-4 hover:bg-copper hover:text-black transition-all">
            <span>Buy Now</span>
            <span className="text-copper-light group-hover:text-black">→</span>
          </a>
        </div>
        <ScrollHint />
      </SceneCard>

      {/* Scene 2 — Reveal */}
      <SceneCard opacity={band(p, 0.13, 0.28)} align="left">
        <p className="text-eyebrow text-copper-light/80 mb-4">CHAPTER I · THE ARTIFACT</p>
        <h2 className="text-display text-4xl md:text-6xl text-white max-w-xl leading-tight">
          A vessel forged for <span className="text-copper-gradient italic">living water</span>.
        </h2>
        <p className="text-white/55 mt-6 max-w-md text-sm md:text-base leading-relaxed">
          Hand-finished copper. Triple-magnetic core. A device engineered as much for the eye as for the molecule.
        </p>
      </SceneCard>

      {/* Scene 3 — Exploded */}
      <SceneCard opacity={band(p, 0.29, 0.45)} align="right">
        <p className="text-eyebrow text-copper-light/80 mb-4">CHAPTER II · ANATOMY</p>
        <h2 className="text-display text-4xl md:text-6xl text-white max-w-xl leading-tight">
          Nine layers, <span className="text-copper-gradient italic">one ritual</span>.
        </h2>
        <ul className="mt-8 space-y-2 text-sm text-white/70 text-right">
          {[
            "Funnel · Copper Intake",
            "Himalayan Mineral Stones",
            "Japanese Energy Stones",
            "Silver Chandi Infusion",
            "Jamun Wood Antibiotic",
            "Magnesium Core",
            "Korean Bio-Ceramic Media",
            "Triple Magnetic Layer",
            "Zinc · Potassium Finish",
          ].map((l) => (
            <li key={l} className="font-mono tracking-wide text-xs md:text-sm">{l}</li>
          ))}
        </ul>
      </SceneCard>

      {/* Scene 4 — Inside water */}
      <SceneCard opacity={band(p, 0.46, 0.6)} align="center">
        <p className="text-eyebrow text-aqua/80 mb-4">CHAPTER III · IMMERSION</p>
        <h2 className="text-display text-4xl md:text-7xl text-white leading-tight">
          Travel <span className="text-copper-gradient italic">inside</span> the water.
        </h2>
      </SceneCard>

      {/* Scene 5 — Magnetic activation */}
      <SceneCard opacity={band(p, 0.61, 0.72)} align="left">
        <p className="text-eyebrow text-copper-light/80 mb-4">CHAPTER IV · ACTIVATION</p>
        <h2 className="text-display text-4xl md:text-6xl text-white max-w-xl leading-tight">
          Magnetism <span className="text-copper-gradient italic">reorders</span> the molecule.
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-6 max-w-md text-white/70">
          <Metric value="8.5–9" label="pH" />
          <Metric value="73+" label="Minerals" />
          <Metric value="3×" label="Magnetic" />
        </div>
      </SceneCard>

      {/* Scene 6 — Transformation */}
      <SceneCard opacity={band(p, 0.73, 0.84)} align="right">
        <p className="text-eyebrow text-aqua/80 mb-4">CHAPTER V · TRANSFORMATION</p>
        <h2 className="text-display text-4xl md:text-6xl text-white max-w-xl leading-tight">
          Common water, <span className="text-copper-gradient italic">refined</span>.
        </h2>
      </SceneCard>

      {/* Scene 7 — Reassembly */}
      <SceneCard opacity={band(p, 0.85, 0.93)} align="center">
        <p className="text-eyebrow text-copper-light/80 mb-4">CHAPTER VI · RETURN</p>
        <h2 className="text-display text-4xl md:text-6xl text-white max-w-xl leading-tight">
          The artifact, <span className="text-copper-gradient italic">restored</span>.
        </h2>
      </SceneCard>

      {/* Scene 8 — Conversion */}
      <SceneCard opacity={band(p, 0.94, 1, 0.03)} align="center">
        <p id="buy" className="text-eyebrow text-copper-light/80 mb-6">— FINAL CHAPTER</p>
        <h2 className="text-display text-4xl md:text-7xl text-white leading-[0.95]">
          Transform your water.<br/>
          Transform your <span className="text-copper-gradient italic">experience</span>.
        </h2>
        <div className="mt-12 pointer-events-auto flex flex-col items-center gap-4">
          <a href="mailto:info.himalayasparsh@gmail.com" className="inline-flex items-center gap-3 text-eyebrow text-black bg-copper-gradient px-12 py-5 hover:opacity-90 transition-opacity">
            Buy Now
          </a>
          <p className="text-eyebrow text-white/40 mt-2">SHIPPING WORLDWIDE · CRAFTED IN INDIA</p>
        </div>
      </SceneCard>

      {/* Progress rail */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 text-eyebrow text-white/40">
        {["I","II","III","IV","V","VI","VII","VIII"].map((c, i) => {
          const active = p >= i / 8 && p < (i + 1) / 8;
          return (
            <div key={c} className={`flex items-center gap-3 transition-all ${active ? "text-copper-light" : ""}`}>
              <span className="tabular-nums">{c.padStart(3,"·")}</span>
              <span className={`h-px transition-all ${active ? "w-8 bg-copper" : "w-3 bg-white/20"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneCard({
  opacity,
  align,
  children,
}: {
  opacity: number;
  align: "left" | "right" | "center";
  children: React.ReactNode;
}) {
  const alignClass =
    align === "left" ? "items-start text-left pl-8 md:pl-20" :
    align === "right" ? "items-end text-right pr-8 md:pr-20" :
    "items-center text-center";
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center ${alignClass}`}
      style={{
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
        transition: "none",
        visibility: opacity < 0.02 ? "hidden" : "visible",
      }}
    >
      <div className="max-w-3xl">{children}</div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-copper/40 pl-3">
      <div className="text-display text-2xl text-copper-light">{value}</div>
      <div className="text-eyebrow text-[0.6rem] text-white/50 mt-1">{label}</div>
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-eyebrow text-white/40 animate-float">
      <span>Scroll to descend</span>
      <span className="h-10 w-px bg-gradient-to-b from-copper/60 to-transparent" />
    </div>
  );
}
