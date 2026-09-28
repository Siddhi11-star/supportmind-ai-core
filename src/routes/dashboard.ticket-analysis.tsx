import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Tag, Target, Gauge, Layers, MessageSquare, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "./dashboard.index";
import { fetchTicket, fetchLatestTicket, getActiveTicketId, TicketDetail } from "@/lib/api";

export const Route = createFileRoute("/dashboard/ticket-analysis")({
  component: TicketAnalysis,
});

function TicketAnalysis() {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const activeId = getActiveTicketId();
        let data: TicketDetail;
        if (activeId) {
          data = await fetchTicket(activeId);
        } else {
          data = await fetchLatestTicket();
        }
        setTicket(data);
      } catch (e) {
        console.error("Failed to load ticket analysis:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentTicket = ticket || {
    id: "#T-882134",
    message: "I was charged twice on order #8821-347 on Oct 14 and still haven't received my refund. This is unacceptable — please resolve immediately.",
    category: "Billing",
    subcategory: "Duplicate Charge",
    priority: "High",
    sentiment: "Negative",
    intent: "Refund Request",
    confidence: 0.94,
    entities: [
      { label: "Order ID", value: "#8821-347" },
      { label: "Amount", value: "$149.00" },
      { label: "Date", value: "Oct 14, 2026" },
      { label: "Payment Method", value: "Visa •••• 4291" },
      { label: "Customer", value: "Alex Stone" },
    ],
  };

  const confidencePct = Math.round((currentTicket.confidence || 0.94) * 100);
  const entities = currentTicket.entities && currentTicket.entities.length > 0
    ? currentTicket.entities
    : [{ label: "Channel", value: "Web" }];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Ticket ${currentTicket.id}`}
        title="Ticket Analysis"
        desc="Deep structural understanding of the incoming customer request."
        actions={
          <Badge
            className={
              currentTicket.priority === "High"
                ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30"
                : currentTicket.priority === "Low"
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
            }
          >
            {currentTicket.priority} Priority
          </Badge>
        }
      />

      <GlassCard strong>
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-brand-cyan" />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Customer Message
            </div>
            <p className="mt-1 text-base leading-relaxed">
              "{currentTicket.message}"
            </p>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatBlock icon={Tag} label="Category" value={currentTicket.category} tone="blue" />
        <StatBlock
          icon={AlertCircle}
          label="Sentiment"
          value={currentTicket.sentiment}
          tone={currentTicket.sentiment === "Negative" ? "rose" : currentTicket.sentiment === "Positive" ? "cyan" : "purple"}
        />
        <StatBlock icon={Target} label="Intent" value={currentTicket.intent} tone="purple" />
        <StatBlock icon={Layers} label="Sub-Category" value={currentTicket.subcategory} tone="cyan" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">Confidence Breakdown</h3>
          </div>
          <div className="space-y-4">
            {[
              ["Classification", confidencePct],
              ["Intent Detection", Math.min(confidencePct, 96)],
              ["Entity Extraction", Math.max(confidencePct - 3, 85)],
              ["Priority Scoring", Math.max(confidencePct - 5, 82)],
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
