import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Himalaya Sparsh" },
      { name: "description", content: "Speak with the Himalaya Sparsh concierge. Bespoke orders, press, and partnerships." },
      { property: "og:title", content: "Contact — Himalaya Sparsh" },
      { property: "og:description", content: "Speak with our concierge." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message received. Our concierge will respond within 24 hours.");
    }, 900);
  };

  return (
    <PageShell
      eyebrow="— THE CONCIERGE"
      title={<>Begin a <span className="text-copper-gradient italic">conversation</span></>}
      subtitle="Bespoke orders, press, partnerships, or simply a question about the ritual."
      variant="mixed"
      density={14}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-32 grid md:grid-cols-5 gap-16">
        <aside className="md:col-span-2 space-y-10 text-white/70">
          <div>
            <p className="text-eyebrow text-copper-light/80 mb-3">ATELIER</p>
            <p className="text-display text-xl leading-relaxed">
              Moradabad,<br />Uttar Pradesh<br />India
            </p>
          </div>
          <div>
            <p className="text-eyebrow text-copper-light/80 mb-3">CONCIERGE</p>
            <a href="mailto:info.himalayasparsh@gmail.com" className="text-display text-xl text-white hover:text-copper-light transition-colors">
              info.himalayasparsh<br />@gmail.com
            </a>
          </div>
          <div>
            <p className="text-eyebrow text-copper-light/80 mb-3">HOURS</p>
            <p className="text-display text-xl">Mon — Sat<br />10:00 — 19:00 IST</p>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="md:col-span-3 space-y-8">
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Subject" name="subject" />
          <div>
            <label className="text-eyebrow text-copper-light/80 block mb-3">MESSAGE</label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full bg-transparent border-b border-copper/30 focus:border-copper outline-none py-3 text-white text-lg resize-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="bg-copper-gradient text-black text-eyebrow px-12 py-5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-eyebrow text-copper-light/80 block mb-3">{label.toUpperCase()}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b border-copper/30 focus:border-copper outline-none py-3 text-white text-lg transition-colors"
      />
    </div>
  );
}
