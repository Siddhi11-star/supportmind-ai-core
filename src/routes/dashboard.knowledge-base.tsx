import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronDown, Star, Link2, Upload, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "./dashboard.index";
import { fetchDocuments, uploadDocumentFile, fetchTicket, getActiveTicketId, KnowledgeDocument } from "@/lib/api";

export const Route = createFileRoute("/dashboard/knowledge-base")({
  component: Knowledge,
});

function Knowledge() {
  const [open, setOpen] = useState<number | null>(0);
  const [docsList, setDocsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const activeId = getActiveTicketId();
      if (activeId) {
        const t = await fetchTicket(activeId);
        if (t.retrieved_docs && t.retrieved_docs.length > 0) {
          setDocsList(t.retrieved_docs);
          setLoading(false);
          return;
        }
      }
      const allDocs = await fetchDocuments();
      setDocsList(allDocs.map((d, i) => ({
        name: d.name,
        source: d.source,
        rank: i + 1,
        score: Math.max(0.96 - i * 0.07, 0.70),
        snippet: d.snippet || "Enterprise indexed knowledge context",
      })));
    } catch (e) {
      console.error("Failed to load documents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    toast("Indexing document with embeddings into vector store…");
    try {
      await uploadDocumentFile(file);
      toast.success(`'${file.name}' indexed successfully`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const docs = docsList.length > 0 ? docsList : [
    {
      name: "Refund Policy v3.2",
      source: "policies/refund-policy.md",
      rank: 1,
      score: 0.96,
      snippet:
        "Duplicate charges are refunded automatically within 5 business days upon verification. Reference the original transaction and issue reference #RF-*.",
    },
    {
      name: "Billing FAQ",
      source: "kb/billing-faq.md",
      rank: 2,
      score: 0.9,
      snippet:
        "If a customer reports being charged twice, cross-check the transaction gateway logs for identical amount + timestamp within 60 seconds.",
    },
    {
      name: "Chargeback Prevention Guide",
      source: "kb/chargeback-guide.md",
      rank: 3,
      score: 0.83,
      snippet:
        "Proactively refunding legitimate duplicate charges reduces chargeback risk and preserves merchant reputation with the card networks.",
    },
    {
      name: "Stripe Integration Notes",
      source: "eng/stripe-notes.md",
      rank: 4,
      score: 0.71,
      snippet:
        "Idempotency keys prevent duplicate charges; when missing, the retry path in checkout may produce two authorizations.",
    },
  ];

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.md,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />
      <PageHeader
        eyebrow="RAG Pipeline"
        title="Knowledge Retrieval"
        desc="Top matching documents retrieved from your company knowledge base."
        actions={
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="border-white/15 bg-white/5 hover:bg-white/10"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-cyan" />
                Indexing…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4 text-brand-cyan" />
                Upload Document (PDF/MD)
              </>
            )}
          </Button>
        }
      />

      <div className="grid gap-3">
        {docs.map((d, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard interactive className="cursor-pointer" onClick={() => setOpen(isOpen ? null : i)}>
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand-soft ring-1 ring-white/10">
                    <FileText className="h-4 w-4 text-brand-cyan" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        #{d.rank}
                      </span>
                      <h3 className="truncate text-sm font-semibold">{d.name}</h3>
                      <Badge className="bg-gradient-brand-soft text-brand-cyan ring-1 ring-white/10">
                        <Star className="mr-1 h-3 w-3" />
                        {(d.score * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" /> {d.source}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? 16 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-muted-foreground">
                    {d.snippet}
                  </div>
                </motion.div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
