import type { ReactNode } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { H2OHero3D } from "@/components/experience/H2OLattice";

interface Props {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  variant?: "aqua" | "copper" | "mixed";
  density?: number;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, subtitle, variant = "mixed", density = 14, children }: Props) {
  return (
    <div className="relative min-h-screen bg-[#03060c] text-white">
      <SiteNav transparent />
      {/* 3D Hero */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <H2OHero3D variant={variant} density={density} />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <p className="text-eyebrow text-copper-light/80 mb-6 animate-shimmer">{eyebrow}</p>
          <h1 className="text-display text-5xl md:text-8xl leading-[0.95]">{title}</h1>
          {subtitle && <p className="text-display text-xl md:text-2xl text-white/60 mt-6 italic max-w-2xl">{subtitle}</p>}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-eyebrow text-white/40 animate-float">
            <span>Scroll</span>
            <span className="h-10 w-px bg-gradient-to-b from-copper/60 to-transparent" />
          </div>
        </div>
      </section>

      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
