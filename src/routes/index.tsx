import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { Experience } from "@/components/experience/Scene";
import { Overlay } from "@/components/experience/Overlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Himalaya Sparsh — The Living Water Revolution" },
      { name: "description", content: "A cinematic immersive experience for Himalaya Sparsh: the magnetic living water device. Hand-finished copper, triple-magnetic core, 73+ trace minerals." },
      { property: "og:title", content: "Himalaya Sparsh — The Living Water Revolution" },
      { property: "og:description", content: "Step inside the molecule. A scroll-driven cinematic journey through the magnetic living water device." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lenis: Lenis | null = null;
    // Disable smooth scrolling on touch / low-power; keep raf-driven progress reading
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
    } catch {
      lenis = null;
    }
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    };
    const loop = (time: number) => {
      if (lenis) lenis.raf(time);
      update();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#03060c]">
      <Experience scrollRef={scrollRef} />
      <Overlay scrollRef={scrollRef} />
      {/* Scroll-driving spacer: 8 viewport heights */}
      <div style={{ height: "800vh" }} />
      {/* Footer */}
      <footer className="relative z-10 border-t border-copper/20 bg-[#03060c] px-8 md:px-14 py-10 flex flex-col md:flex-row justify-between gap-4 text-eyebrow text-white/40">
        <span>© MMXXVI HIMALAYA SPARSH</span>
        <span>INFO.HIMALAYASPARSH@GMAIL.COM</span>
        <span>@HIMALAYASPARSH</span>
      </footer>
    </div>
  );
}
