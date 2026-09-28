import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Send, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "./dashboard.index";

import { submitTicket, setActiveTicketId, TicketDetail } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/new-ticket")({
  component: NewTicket,
});

function NewTicket() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [processedTicket, setProcessedTicket] = useState<TicketDetail | null>(null);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setProcessedTicket(null);
    try {
      const ticket = await submitTicket({ message: text });
      setActiveTicketId(ticket.id);
      setProcessedTicket(ticket);
      toast.success(`Ticket ${ticket.id} created and analyzed`);
    } catch (err: any) {
      toast.error(err.message || "Failed to process ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intake"
        title="Submit a New Ticket"
        desc="The AI pipeline will classify, retrieve, and generate a grounded response."
      />

      <GlassCard strong className="relative overflow-hidden">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
          AI-assisted intake · Grounded RAG · Guardrails enforced
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I was charged twice and still haven't received my refund."
          className="min-h-40 resize-none border-white/10 bg-white/[0.03] text-base placeholder:text-muted-foreground/60 focus-visible:ring-brand-blue/50"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="border-white/15 bg-white/5 hover:bg-white/10"
          >
            <Paperclip className="mr-2 h-4 w-4" /> Upload Attachment
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {text.length} chars
            </span>
            <Button
              onClick={submit}
              disabled={loading || !text.trim()}
              className="bg-gradient-brand text-white shadow-lg glow-brand hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit Ticket
                </>
              )}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 shimmer-bg" />
        )}
      </GlassCard>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-3 md:grid-cols-4"
          >
            {["Understanding", "Retrieving", "Generating", "Evaluating"].map((s, i) => (
              <GlassCard key={s} className="text-center">
                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-brand-cyan" />
                <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                <div className="text-sm font-medium">{s}</div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {processedTicket && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                    ✓
                  </span>
                  Ticket <span className="font-mono">{processedTicket.id}</span> processed
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Classified as <span className="font-medium text-brand-cyan">{processedTicket.category}</span> · Intent: {processedTicket.intent}
                </div>
              </div>
              <Button
                asChild
                className="bg-gradient-brand text-white shadow-lg glow-brand hover:opacity-95"
              >
                <Link to="/dashboard/ticket-analysis">
                  View Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
