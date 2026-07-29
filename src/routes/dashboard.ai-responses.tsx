import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Download, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "./dashboard.index";

export const Route = createFileRoute("/dashboard/ai-responses")({
  component: AIResponse,
});

const initial = `Hi Alex,

Thanks for reaching out — I'm sorry for the trouble with your recent order.

I've reviewed your account and confirmed the duplicate charge on order #8821-347 from October 14, 2026 for $149.00. As per our Refund Policy v3.2, duplicate charges are refunded automatically within 5 business days.

I've issued a refund of $149.00 to your Visa ending in 4291. Reference number: #RF-882134. You should see the credit within 3–5 business days.

If you don't see the refund by October 24, please reply and I'll escalate immediately.

Best regards,
SupportMind AI`;

function AIResponse() {
  const [text, setText] = useState(initial);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Generation"
        title="AI Response"
        desc="Grounded, guarded, and evaluated before delivery."
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="mr-1 h-3 w-3" /> Grounded
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
              <AlertTriangle className="mr-1 h-3 w-3" /> Low Risk
            </Badge>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard strong className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" /> Response · Qwen-2.5 · 14B
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-80 resize-none border-white/10 bg-white/[0.03] text-sm leading-relaxed focus-visible:ring-brand-blue/50"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => {
                navigator.clipboard.writeText(text);
                toast.success("Response copied");
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => toast("Regenerating with fresh retrieval…")}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => toast.success("PDF export queued")}
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button className="ml-auto bg-gradient-brand text-white shadow-lg glow-brand hover:opacity-95">
              Send Response
            </Button>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold">Signals</h3>
            <div className="mt-3 space-y-3">
              <SignalRow label="Confidence" value={96} tone="cyan" />
              <SignalRow label="Groundedness" value={94} tone="cyan" />
              <SignalRow label="Hallucination Risk" value={4} tone="rose" invert />
              <SignalRow label="Tone Score" value={92} tone="cyan" />
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-semibold">Grounded Sources</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Refund Policy v3.2", "Billing FAQ", "Chargeback Guide"].map((s) => (
                <li
                  key={s}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <span>{s}</span>
                  <Badge variant="outline" className="border-white/15 text-xs">
                    cited
                  </Badge>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SignalRow({
  label,
  value,
  tone,
  invert,
}: {
  label: string;
  value: number;
  tone: "cyan" | "rose";
  invert?: boolean;
}) {
  const barColor = invert
    ? "linear-gradient(90deg, oklch(0.7 0.2 25), oklch(0.75 0.2 55))"
    : "var(--gradient-brand)";
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={tone === "rose" ? "text-rose-300" : "text-brand-cyan"}>
          {value}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full" style={{ width: value + "%", background: barColor }} />
      </div>
    </div>
  );
}
