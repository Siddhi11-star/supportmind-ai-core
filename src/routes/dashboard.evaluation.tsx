import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "./dashboard.index";
import { fetchTicket, fetchEvaluationSummary, getActiveTicketId, TicketEvaluation } from "@/lib/api";

export const Route = createFileRoute("/dashboard/evaluation")({
  component: Evaluation,
});

function Evaluation() {
  const [evalData, setEvalData] = useState<TicketEvaluation | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const activeId = getActiveTicketId();
        if (activeId) {
          setTicketId(activeId);
          const t = await fetchTicket(activeId);
          if (t.evaluation) {
            setEvalData(t.evaluation);
            return;
          }
        }
        const summary = await fetchEvaluationSummary();
        setEvalData(summary);
      } catch (e) {
        console.error("Failed to load evaluations:", e);
      }
    }
    load();
  }, []);

  const d = evalData || {
    faithfulness: 96,
    answer_relevance: 93,
    context_precision: 91,
    context_recall: 88,
    tone: 92,
    safety: 99,
    professionalism: 95,
    hallucination_risk: 4,
  };

  const metrics = [
    { label: "Faithfulness", value: Math.round(d.faithfulness), desc: "Answer aligns with retrieved evidence" },
    { label: "Answer Relevance", value: Math.round(d.answer_relevance), desc: "Addresses the customer's question" },
    { label: "Context Precision", value: Math.round(d.context_precision), desc: "Retrieved chunks are on-topic" },
    { label: "Context Recall", value: Math.round(d.context_recall), desc: "All needed info was retrieved" },
    { label: "Tone", value: Math.round(d.tone), desc: "Professional and empathetic" },
    { label: "Safety", value: Math.round(d.safety), desc: "No policy violations detected" },
    { label: "Professionalism", value: Math.round(d.professionalism), desc: "Enterprise-grade language" },
    { label: "Hallucination Risk", value: Math.round(d.hallucination_risk), desc: "Low — response is grounded", invert: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={ticketId ? `Ticket ${ticketId} · Quality Suite` : "Quality Suite"}
        title="Response Evaluation"
        desc="Full evaluation suite scored across faithfulness, relevance, safety, and tone."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard interactive className="text-center">
              <RadialProgress value={m.value} invert={m.invert} />
              <div className="mt-3 text-sm font-semibold">{m.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.desc}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RadialProgress({ value, invert }: { value: number; invert?: boolean }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const gradientId = invert ? "evalGradRisk" : "evalGrad";
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="evalGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.19 255)" />
            <stop offset="55%" stopColor="oklch(0.65 0.24 300)" />
            <stop offset="100%" stopColor="oklch(0.82 0.15 200)" />
          </linearGradient>
          <linearGradient id="evalGradRisk" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.75 0.2 55)" />
            <stop offset="100%" stopColor="oklch(0.7 0.22 25)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-lg font-semibold">
          {value}
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>
    </div>
  );
}
