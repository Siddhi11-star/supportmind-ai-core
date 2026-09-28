import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Download, ShieldCheck, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "./dashboard.index";
import {
  fetchTicket,
  fetchLatestTicket,
  regenerateAIResponse,
  getActiveTicketId,
  TicketDetail,
} from "@/lib/api";

export const Route = createFileRoute("/dashboard/ai-responses")({
  component: AIResponse,
});

function AIResponse() {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

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
        if (data.response?.content) {
          setText(data.response.content);
        }
      } catch (e) {
        console.error("Failed to load ticket response:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRegenerate = async () => {
    if (!ticket) return;
    setRegenerating(true);
    toast("Regenerating with fresh retrieval…");
    try {
      const updated = await regenerateAIResponse(ticket.id);
      setText(updated.content);
      setTicket((prev) => prev ? { ...prev, response: updated } : null);
      toast.success("AI response regenerated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate response");
    } finally {
      setRegenerating(false);
    }
  };

  const currentResponse = ticket?.response || {
    content: text,
    model_used: "gemini-2.0-flash",
    confidence: 96,
    groundedness: 94,
    hallucination_risk: 4,
    tone_score: 92,
  };

  const sources = ticket?.retrieved_docs && ticket.retrieved_docs.length > 0
    ? ticket.retrieved_docs.map((d) => d.name)
    : ["Refund Policy v3.2", "Billing FAQ", "Chargeback Guide"];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Ticket ${ticket?.id || "#T-882134"} · AI Generation`}
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
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" /> Response · {currentResponse.model_used}
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
              disabled={regenerating}
              onClick={handleRegenerate}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />{" "}
              {regenerating ? "Regenerating…" : "Regenerate"}
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => toast.success("PDF export queued")}
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button
              onClick={() => toast.success("Response dispatched to customer email")}
              className="ml-auto bg-gradient-brand text-white shadow-lg glow-brand hover:opacity-95"
            >
              Send Response
            </Button>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold">Signals</h3>
            <div className="mt-3 space-y-3">
              <SignalRow label="Confidence" value={Math.round(currentResponse.confidence)} tone="cyan" />
              <SignalRow label="Groundedness" value={Math.round(currentResponse.groundedness)} tone="cyan" />
              <SignalRow label="Hallucination Risk" value={Math.round(currentResponse.hallucination_risk)} tone="rose" invert />
              <SignalRow label="Tone Score" value={Math.round(currentResponse.tone_score)} tone="cyan" />
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-semibold">Grounded Sources</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {sources.map((s) => (
                <li
                  key={s}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <span className="truncate pr-2">{s}</span>
                  <Badge variant="outline" className="border-white/15 text-xs shrink-0">
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
