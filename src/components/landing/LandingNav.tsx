import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Dashboard", href: "/dashboard", internal: true },
  { label: "About", href: "#about" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass-panel-strong flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand glow-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">SupportMind AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Enterprise
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) =>
            l.internal ? (
              <Link
                key={l.label}
                to={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden md:block">
          <Button asChild className="bg-gradient-brand text-white shadow-lg glow-brand hover:opacity-95">
            <Link to="/dashboard">Launch Dashboard</Link>
          </Button>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-foreground hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "glass-panel-strong absolute top-20 left-4 right-4 rounded-2xl p-3 md:hidden transition-all",
          open ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1">
          {links.map((l) =>
            l.internal ? (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5"
              >
                {l.label}
              </a>
            ),
          )}
          <Button asChild className="mt-2 bg-gradient-brand text-white">
            <Link to="/dashboard">Launch Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
