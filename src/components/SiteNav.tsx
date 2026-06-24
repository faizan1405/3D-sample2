import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/himalaya-logo.png";

const NAV = [
  { to: "/story", label: "Story" },
  { to: "/technology", label: "Technology" },
  { to: "/science", label: "Science" },
  { to: "/buy", label: "Buy" },
] as const;

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 md:px-14 ${
        transparent ? "" : "backdrop-blur-md bg-[#03060c]/40 border-b border-copper/10"
      }`}
    >
      <Link to="/" className="flex items-center gap-3">
        <img src={logoUrl} alt="Himalaya Sparsh" className="h-10 w-auto opacity-95" />
      </Link>
      <nav className="hidden md:flex items-center gap-10 text-eyebrow text-white/70">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="hover:text-copper-light transition-colors"
            activeProps={{ className: "text-copper-light" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <Link
        to="/contact"
        className="text-eyebrow border border-copper/50 px-5 py-2.5 text-white/90 hover:bg-copper hover:text-black transition-all"
      >
        Contact
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-copper/20 bg-[#03060c] px-8 md:px-14 py-10 flex flex-col md:flex-row justify-between gap-4 text-eyebrow text-white/40">
      <span>© MMXXVI HIMALAYA SPARSH</span>
      <span>INFO.HIMALAYASPARSH@GMAIL.COM</span>
      <span>@HIMALAYASPARSH</span>
    </footer>
  );
}
