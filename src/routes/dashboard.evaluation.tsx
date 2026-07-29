import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "./dashboard.index";

export const Route = createFileRoute("/dashboard/evaluation")({
  component: Evaluation,
});

const metrics = [
  { label: "Faithfulness", value: 96, desc: "Answer aligns with retrieved evidence" },
  { label: "Answer Relevance", value: 93, desc: "Addresses the customer's question" },
  { label: "Context Precision", value: 91, desc: "Retrieved chunks are on-topic" },
  { label: "Context Recall", value: 88, desc: "All needed info was retrieved" },
  { label: "Tone", value: 92, desc: "Professional and empathetic" },
  { label: "Safety", value: 99, desc: "No policy violations detected" },
  { label: "Professionalism", value: 95, desc: "Enterprise-grade language" },
  { label: "Hallucination Risk", value: 4, desc: "Low — response is grounded", invert: true },
];

function Evaluation() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quality"
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
