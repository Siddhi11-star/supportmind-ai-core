import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  BookOpen,
  MessageSquareText,
  ClipboardCheck,
  BarChart3,
  Settings,
  Bell,
  Cpu,
  ChevronDown,
  Sparkles,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/new-ticket", label: "New Ticket", icon: PlusCircle },
  { to: "/dashboard/ticket-analysis", label: "Ticket Analysis", icon: Search },
  { to: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { to: "/dashboard/ai-responses", label: "AI Responses", icon: MessageSquareText },
  { to: "/dashboard/evaluation", label: "Evaluation", icon: ClipboardCheck },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="relative flex min-h-screen text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/5 md:block">
        <div className="glass-panel h-full rounded-none border-0 border-r border-white/5 p-4">
          <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand glow-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">SupportMind AI</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Console
              </div>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            {menu.map((m) => {
              const active = m.exact ? pathname === m.to : pathname.startsWith(m.to);
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    active
                      ? "text-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-brand-soft ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <m.icon
                    className={cn(
                      "relative h-4 w-4 shrink-0",
                      active ? "text-brand-cyan" : "text-muted-foreground",
                    )}
                  />
                  <span className="relative">{m.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="glass-panel-strong mt-6 rounded-xl p-3 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Cpu className="h-3.5 w-3.5 text-brand-cyan" /> Gemini 2.0 Flash
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              Cloud API operational
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <TopBar />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav pathname={pathname} />
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-white/5">
      <div className="glass-panel-strong flex items-center gap-3 rounded-none border-0 border-b border-white/5 px-4 py-3 md:px-8">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets, docs, evaluations…"
            className="h-10 w-full rounded-xl border-white/10 bg-white/5 pl-9 pr-16 placeholder:text-muted-foreground/70 focus-visible:ring-brand-blue/50"
          />
          <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground md:flex">
            <Command className="h-3 w-3" />K
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs md:flex">
            <Cpu className="h-3.5 w-3.5 text-brand-cyan" />
            <span className="text-muted-foreground">Model:</span>
            <span className="font-medium">Gemini 2.0 Flash</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            <span className="text-muted-foreground">Operational</span>
          </div>
          <button className="relative rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-cyan" />
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-1 pl-1 pr-3">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand text-xs font-semibold text-white">
              AS
            </div>
            <div className="hidden text-xs leading-tight md:block">
              <div className="font-medium">Alex Stone</div>
              <div className="text-muted-foreground">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const items = menu.slice(0, 5);
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 md:hidden">
      <div className="glass-panel-strong flex items-center justify-around rounded-2xl px-2 py-2">
        {items.map((m) => {
          const active = m.exact ? pathname === m.to : pathname.startsWith(m.to);
          return (
            <Link
              key={m.to}
              to={m.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px]",
                active ? "text-white" : "text-muted-foreground",
              )}
            >
              <m.icon
                className={cn("h-4 w-4", active ? "text-brand-cyan" : "")}
              />
              {m.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
