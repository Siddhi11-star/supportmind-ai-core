import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, Tag, Target, Gauge, Layers, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "./dashboard.index";

export const Route = createFileRoute("/dashboard/ticket-analysis")({
  component: TicketAnalysis,
});

const entities = [
  { label: "Order ID", value: "#8821-347" },
  { label: "Amount", value: "$149.00" },
  { label: "Date", value: "Oct 14, 2026" },
  { label: "Payment Method", value: "Visa •••• 4291" },
  { label: "Customer", value: "Alex Stone" },
];

function TicketAnalysis() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ticket #T-882134"
        title="Ticket Analysis"
        desc="Deep structural understanding of the incoming customer request."
        actions={
          <Badge className="bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
            High Priority
          </Badge>
        }
      />

      <GlassCard strong>
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-brand-cyan" />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Customer Message
            </div>
            <p className="mt-1 text-base leading-relaxed">
              "I was charged twice on order <span className="text-foreground">#8821-347</span>{" "}
              on Oct 14 and still haven't received my refund. This is unacceptable — please
              resolve immediately."
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatBlock icon={Tag} label="Category" value="Billing" tone="blue" />
        <StatBlock icon={AlertCircle} label="Sentiment" value="Negative" tone="rose" />
        <StatBlock icon={Target} label="Intent" value="Refund Request" tone="purple" />
        <StatBlock icon={Layers} label="Sub-Category" value="Duplicate Charge" tone="cyan" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">Confidence Breakdown</h3>
          </div>
          <div className="space-y-4">
            {[
              ["Classification", 96],
              ["Intent Detection", 94],
              ["Entity Extraction", 91],
              ["Priority Scoring", 88],
            ].map(([k, v], i) => (
              <motion.div
                key={k as string}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-brand-cyan">{v}%</span>
                </div>
                <Progress
                  value={v as number}
                  className="h-2 bg-white/5 [&>div]:bg-gradient-brand"
                />
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">Detected Entities</h3>
          <div className="mt-3 space-y-2">
            {entities.map((e) => (
              <div
                key={e.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm"
              >
                <span className="text-xs text-muted-foreground">{e.label}</span>
                <span className="font-mono text-xs">{e.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  tone: string;
}) {
  const tones: Record<string, string> = {
    blue: "text-brand-blue",
    purple: "text-brand-purple",
    cyan: "text-brand-cyan",
    rose: "text-rose-300",
  };
  return (
    <GlassCard interactive>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft ring-1 ring-white/10">
          <Icon className={"h-4 w-4 " + (tones[tone] ?? "text-brand-cyan")} />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="text-base font-semibold">{value}</div>
        </div>
      </div>
    </GlassCard>
  );
}
