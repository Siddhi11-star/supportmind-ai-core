import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Clock,
  Smile,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { fetchTickets, fetchAnalytics, setActiveTicketId, TicketListItem, AnalyticsData } from "@/lib/api";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const navigate = useNavigate();
  const [ticketsList, setTicketsList] = useState<TicketListItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tList, anData] = await Promise.all([
          fetchTickets(),
          fetchAnalytics(),
        ]);
        if (tList.length > 0) setTicketsList(tList);
        setAnalytics(anData);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      }
    }
    load();
  }, []);

  const stats = [
    {
      icon: Ticket,
      label: "Total Tickets",
      value: analytics?.total_tickets || 12847,
      decimals: 0,
      delta: "+12.4%",
      up: true,
    },
    {
      icon: CheckCircle2,
      label: "Resolved Tickets",
      value: analytics?.resolved_tickets || 11782,
      delta: "+9.1%",
      up: true,
    },
    {
      icon: AlertTriangle,
      label: "Escalated",
      value: analytics?.escalated_tickets || 421,
      delta: "-3.2%",
      up: false,
    },
    {
      icon: Gauge,
      label: "Avg. Confidence",
      value: analytics?.avg_confidence || 96.4,
      decimals: 1,
      suffix: "%",
      delta: "+2.3%",
      up: true,
    },
    {
      icon: Clock,
      label: "Avg. Response",
      value: 3.2,
      decimals: 1,
      suffix: "s",
      delta: "-0.4s",
      up: true,
    },
    {
      icon: Smile,
      label: "CSAT",
      value: analytics?.csat || 94.7,
      decimals: 1,
      suffix: "%",
      delta: "+1.1%",
      up: true,
    },
  ];

  const trendData = Array.from({ length: 14 }).map((_, i) => ({
    d: `D${i + 1}`,
    tickets: 620 + Math.round(Math.sin(i / 2) * 120 + Math.random() * 80),
    resolved: 560 + Math.round(Math.sin(i / 2) * 100 + Math.random() * 80),
  }));

  const catData = analytics?.categories || [
    { name: "Billing", value: 32 },
    { name: "Technical", value: 28 },
    { name: "Account", value: 18 },
    { name: "Shipping", value: 14 },
    { name: "Other", value: 8 },
  ];

  const recent = ticketsList.length > 0
    ? ticketsList.map((t) => ({
        id: t.id,
        subject: t.subject,
        pri: t.priority,
        cat: t.category,
        conf: t.confidence,
      }))
    : [
        { id: "#T-882134", subject: "Duplicate charge on invoice", pri: "High", cat: "Billing", conf: 0.96 },
        { id: "#T-882131", subject: "Cannot reset password", pri: "Medium", cat: "Account", conf: 0.91 },
        { id: "#T-882127", subject: "Shipment delayed to EU warehouse", pri: "Low", cat: "Shipping", conf: 0.88 },
        { id: "#T-882122", subject: "API returning 500 on v2/orders", pri: "High", cat: "Technical", conf: 0.94 },
        { id: "#T-882119", subject: "Update billing address", pri: "Low", cat: "Account", conf: 0.97 },
      ];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Support Intelligence Dashboard"
        desc="Real-time performance across ticket volume, AI confidence, and resolution quality."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <GlassCard interactive className="group h-full">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft ring-1 ring-white/10 transition group-hover:scale-105">
                  <s.icon className="h-4 w-4 text-brand-cyan" />
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="text-2xl font-semibold tracking-tight">
                  <AnimatedCounter
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix ?? ""}
                  />
                </div>
                <div
                  className={
                    "flex items-center gap-0.5 text-xs " +
                    (s.up ? "text-emerald-400" : "text-rose-400")
                  }
                >
                  {s.up ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {s.delta}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Ticket Volume · 14d</h3>
              <p className="text-xs text-muted-foreground">
                Total vs. AI-resolved tickets
              </p>
            </div>
            <Badge className="bg-gradient-brand-soft text-brand-cyan hover:bg-gradient-brand-soft">
              <Sparkles className="mr-1 h-3 w-3" /> AI Insight ready
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.19 255)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.68 0.19 255)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.24 300)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 300)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="oklch(0.68 0.19 255)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="oklch(0.65 0.24 300)"
                  strokeWidth={2}
                  fill="url(#g2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Categories</h3>
          <p className="text-xs text-muted-foreground">Distribution across last 30 days</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={11}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="oklch(0.68 0.19 265)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Recent Tickets</h3>
            <p className="text-xs text-muted-foreground">Latest AI-processed queue</p>
          </div>
          <Badge variant="outline" className="border-white/15 text-muted-foreground">
            Live
          </Badge>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Ticket</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-right font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => {
                    setActiveTicketId(r.id);
                    navigate({ to: "/dashboard/ticket-analysis" });
                  }}
                  className="border-t border-white/5 transition hover:bg-white/[0.05] cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-xs text-brand-cyan">
                    {r.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.subject}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-white/15">
                      {r.cat}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityPill p={r.pri} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-brand-cyan font-mono">
                      {(r.conf * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions}
    </div>
  );
}

function PriorityPill({ p }: { p: string }) {
  const map: Record<string, string> = {
    High: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
    Medium: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    Low: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  };
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 " +
        (map[p] ?? "")
      }
    >
      {p}
    </span>
  );
}
