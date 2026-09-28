import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "./dashboard.index";
import { Cpu, KeyRound, ShieldCheck, Bell, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { fetchSettings, switchActiveProvider, SystemSettings } from "@/lib/api";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
  const [config, setConfig] = useState<SystemSettings | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await fetchSettings();
        setConfig(s);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    load();
  }, []);

  const handleProviderSwitch = async (prov: "gemini" | "gpt_oss") => {
    try {
      await switchActiveProvider(prov);
      setConfig((prev) => (prev ? { ...prev, active_provider: prov } : null));
      toast.success(`Active provider switched to ${prov === "gemini" ? "Google Gemini" : "GPT-OSS"}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to switch provider");
    }
  };

  const primaryModel = config?.gemini_model || "gemini-2.0-flash";
  const fallbackModel = config?.gpt_oss_model || "openai/gpt-oss-20b";
  const activeProv = config?.active_provider || "gemini";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        desc="Manage AI models, guardrails, notifications, and API access."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">Cloud AI Models</h3>
            <Badge className="ml-auto bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              Active: {activeProv.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
                  Primary: Google Gemini
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Model: {primaryModel} · {config?.gemini_configured ? "API Key Configured" : "Heuristic fallback active"}
                </div>
              </div>
              <Button
                size="sm"
                variant={activeProv === "gemini" ? "default" : "outline"}
                className={activeProv === "gemini" ? "bg-gradient-brand text-white" : "border-white/10"}
                onClick={() => handleProviderSwitch("gemini")}
              >
                {activeProv === "gemini" ? "Active" : "Use Gemini"}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <div className="text-sm font-medium">Alternative: Hosted GPT-OSS</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Model: {fallbackModel} (via Groq/Open-weight)
                </div>
              </div>
              <Button
                size="sm"
                variant={activeProv === "gpt_oss" ? "default" : "outline"}
                className={activeProv === "gpt_oss" ? "bg-gradient-brand text-white" : "border-white/10"}
                onClick={() => handleProviderSwitch("gpt_oss")}
              >
                {activeProv === "gpt_oss" ? "Active" : "Use GPT-OSS"}
              </Button>
            </div>

            <Field label="Embeddings API" value="Google Gemini (text-embedding-004)" />
            <Field label="Vector Store" value="In-memory / Persistent RAG Vector DB" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">Guardrails</h3>
          </div>
          <div className="space-y-4">
            <Toggle label="PII Redaction" defaultChecked />
            <Toggle label="Hallucination Filter" defaultChecked />
            <Toggle label="Profanity Filter" defaultChecked />
            <Toggle label="Human Escalation on Low Confidence" defaultChecked />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <Toggle label="Slack alerts on escalation" defaultChecked />
            <Toggle label="Weekly performance digest" defaultChecked />
            <Toggle label="Model drift alerts" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-semibold">API Access</h3>
          </div>
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">API Endpoint</Label>
            <Input
              value="https://api.supportmind.ai/v1"
              readOnly
              className="border-white/10 bg-white/5 font-mono text-xs"
            />
            <Label className="text-xs text-muted-foreground">API Key</Label>
            <Input
              value="sm_live_••••••••••••••7f2a"
              readOnly
              className="border-white/10 bg-white/5 font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button className="bg-gradient-brand text-white glow-brand hover:opacity-95">
                Rotate Key
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/5">
                View Docs
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <Label className="text-sm">{label}</Label>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
