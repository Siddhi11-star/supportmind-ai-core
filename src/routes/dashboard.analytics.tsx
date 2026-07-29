import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "./dashboard.index";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

const monthly = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
  (m, i) => ({ m, tickets: 800 + Math.round(Math.sin(i / 2) * 200 + Math.random() * 150) }),
);
const daily = Array.from({ length: 30 }).map((_, i) => ({
  d: i + 1,
  v: 40 + Math.round(Math.sin(i / 3) * 15 + Math.random() * 12),
}));
const cats = [
  { name: "Billing", v: 32 },
  { name: "Technical", v: 28 },
  { name: "Account", v: 18 },
  { name: "Shipping", v: 14 },
  { name: "Other", v: 8 },
];
const sentiment = [
  { name: "Positive", v: 48, fill: "oklch(0.75 0.18 160)" },
  { name: "Neutral", v: 34, fill: "oklch(0.68 0.19 255)" },
  { name: "Negative", v: 18, fill: "oklch(0.7 0.22 25)" },
];
const csat = Array.from({ length: 12 }).map((_, i) => ({
  m: i,
  v: 88 + Math.round(Math.sin(i) * 4 + Math.random() * 3),
}));
const accuracy = [{ name: "Accuracy", value: 96, fill: "oklch(0.65 0.24 300)" }];

const tooltipStyle = {
  background: "rgba(15,15,30,0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
};

function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        desc="AI performance, volume trends, sentiment, and satisfaction."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-sm font-semibold">Monthly Tickets</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.19 255)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.68 0.19 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="tickets" stroke="oklch(0.68 0.19 255)" strokeWidth={2} fill="url(#ga)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">AI Accuracy</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={accuracy} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-40 text-center">
              <div className="text-4xl font-semibold text-gradient-brand">96%</div>
              <div className="text-xs text-muted-foreground">Faithfulness · 30d</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Ticket Categories</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <BarChart data={cats}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="v" radius={[8, 8, 0, 0]} fill="oklch(0.65 0.24 300)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Daily Trends · 30d</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <LineChart data={daily}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.82 0.15 200)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Sentiment Distribution</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sentiment} dataKey="v" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {sentiment.map((s) => (
                    <Cell key={s.name} fill={s.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            {sentiment.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
                {s.name} · {s.v}%
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h3 className="text-sm font-semibold">Customer Satisfaction · 12mo</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <AreaChart data={csat}>
                <defs>
                  <linearGradient id="gc" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 160)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.75 0.18 160)" strokeWidth={2} fill="url(#gc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Escalation Rate</h3>
          <div className="mt-6 flex items-end gap-2">
            <div className="text-5xl font-semibold text-gradient-brand">3.2%</div>
            <div className="mb-1 text-xs text-emerald-400">-0.6%</div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Only 3.2% of AI responses required human escalation this month.
          </p>
          <div className="mt-6 space-y-2">
            {[
              ["Avg. Resolution", "1h 22m"],
              ["First Contact", "94.1%"],
              ["Bot Handoff", "5.9%"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
              >
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
