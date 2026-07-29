import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "./dashboard.index";
import { Cpu, KeyRound, ShieldCheck, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
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
            <h3 className="text-sm font-semibold">AI Model</h3>
            <Badge className="ml-auto bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              Active
            </Badge>
          </div>
          <div className="space-y-4">
            <Field label="Primary Model" value="Qwen-2.5 · 14B" />
            <Field label="Fallback Model" value="Llama-3.1 · 8B" />
            <Field label="Embeddings" value="bge-large-en-v1.5" />
            <Field label="Vector Store" value="FAISS · 1.2M vectors" />
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
