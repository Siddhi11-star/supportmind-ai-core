import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Database,
  MessageSquareCode,
  Activity,
  Layers,
  BarChart3,
  Ticket,
  Cpu,
  Search,
  BadgeCheck,
  ScrollText,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Ticket Understanding",
    desc: "Automatically detects category, intent, sentiment, priority, and key entities in every incoming ticket.",
  },
  {
    icon: Database,
    title: "Knowledge Retrieval",
    desc: "Retrieval-Augmented Generation searches company documentation before crafting any response.",
  },
  {
    icon: MessageSquareCode,
    title: "Professional Responses",
    desc: "Generates accurate, context-aware customer responses grounded in retrieved knowledge.",
  },
  {
    icon: ShieldCheck,
    title: "AI Guardrails",
    desc: "Reduces hallucinations and validates every response for safety and factual consistency.",
  },
  {
    icon: Activity,
    title: "Evaluation Engine",
    desc: "Measures faithfulness, answer relevance, precision, recall, tone, and confidence.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Visualizes ticket trends, sentiment, escalations, AI confidence, and performance.",
  },
];

const workflowSteps = [
  { icon: Ticket, label: "Customer Ticket" },
  { icon: BrainCircuit, label: "Ticket Understanding" },
  { icon: Search, label: "Knowledge Retrieval (RAG)" },
  { icon: Cpu, label: "LLM Response Generation" },
  { icon: ShieldCheck, label: "Guardrails" },
  { icon: BadgeCheck, label: "Evaluation" },
  { icon: BarChart3, label: "Analytics" },
];

const techBadges = [
  "LLMs",
  "FastAPI",
  "LangChain",
  "FAISS",
  "Ollama",
  "Qwen",
  "RAG",
  "Evaluation",
  "Glassmorphism",
  "Tailwind CSS",
];

const stats = [
  { value: 92, suffix: "%", label: "Auto-Resolved" },
  { value: 3.2, decimals: 1, suffix: "s", label: "Avg. Response" },
  { value: 98, suffix: "%", label: "Faithfulness" },
  { value: 47, suffix: "M+", label: "Tickets Analyzed" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export function LandingHero() {
  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-glow" />
              <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
            </span>
            LLM · RAG · Guardrails · Evaluation
            <Sparkles className="h-3 w-3 text-brand-cyan" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            Transform Customer Support with{" "}
            <span className="text-gradient-brand">Enterprise AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            SupportMind AI uses Large Language Models, Retrieval-Augmented Generation,
            intelligent ticket understanding, and AI evaluation to automate customer
            support while ensuring accurate, grounded, professional responses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-gradient-brand px-6 text-white shadow-xl glow-brand-lg hover:opacity-95"
            >
              <Link to="/dashboard">
                Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/15 bg-white/5 px-6 text-foreground backdrop-blur hover:bg-white/10"
            >
              <a href="#features">Learn More</a>
            </Button>
          </motion.div>
        </div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="absolute inset-x-8 -top-8 h-72 rounded-[3rem] bg-gradient-brand opacity-20 blur-3xl" />
          <GlassCard strong className="relative overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <div className="ml-3 text-xs text-muted-foreground">
                supportmind.ai / dashboard
              </div>
              <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Qwen-2.5 · Online
              </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3">
              <MockStatCard icon={Ticket} label="Total Tickets" value="12,847" trend="+12.4%" />
              <MockStatCard icon={CheckCircle2} label="Resolved" value="11,782" trend="+9.1%" />
              <MockStatCard icon={TrendingUp} label="Confidence" value="96.4%" trend="+2.3%" />

              <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Ticket Analysis
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      "I was charged twice and still haven't received my refund."
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-purple/20 px-2.5 py-1 text-[10px] font-medium text-brand-purple">
                    High Priority
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  {[
                    { k: "Category", v: "Billing" },
                    { k: "Sentiment", v: "Negative" },
                    { k: "Intent", v: "Refund" },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {x.k}
                      </div>
                      <div className="mt-1 text-sm font-medium">{x.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-brand-cyan" /> AI Response · Grounded
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Hi Alex — I've located the duplicate charge from Oct 14. I've issued
                    a refund of <span className="text-foreground">$149.00</span> which
                    will appear in 3–5 business days. Reference:{" "}
                    <span className="text-foreground">#RF-882134</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" /> Retrieved Docs
                  </div>
                  {["Refund Policy v3.2", "Billing FAQ", "Chargeback Guide"].map(
                    (d, i) => (
                      <div key={d} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-foreground/90">{d}</span>
                        <span className="text-[10px] text-brand-cyan">
                          {(0.94 - i * 0.06).toFixed(2)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 text-xs text-muted-foreground">Evaluation</div>
                  {[
                    ["Faithfulness", 0.96],
                    ["Relevance", 0.93],
                    ["Tone", 0.91],
                  ].map(([k, v]) => (
                    <div key={k as string} className="mb-2 last:mb-0">
                      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>{k}</span>
                        <span>{((v as number) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${(v as number) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="text-center">
                <div className="text-3xl font-semibold text-gradient-brand md:text-4xl">
                  <AnimatedCounter
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                  />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MockStatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand-soft">
          <Icon className="h-4 w-4 text-brand-cyan" />
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-emerald-400">{trend}</div>
      </div>
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Platform"
          title={
            <>
              A complete <span className="text-gradient-brand">AI stack</span> for
              customer support
            </>
          }
          desc="Every layer of a production LLM system — from understanding to evaluation — built into one enterprise platform."
        />
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <GlassCard interactive className="group h-full">
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand-soft ring-1 ring-white/10">
                  <f.icon className="h-5 w-5 text-brand-cyan" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function LandingWorkflow() {
  return (
    <section id="workflow" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Workflow"
          title={
            <>
              From ticket to insight, <span className="text-gradient-brand">end-to-end</span>
            </>
          }
          desc="Every incoming ticket flows through a rigorous AI pipeline — understood, grounded, guarded, evaluated, and analyzed."
        />

        <div className="relative mt-14">
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:overflow-x-auto md:pb-4">
            {workflowSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 md:flex-col md:gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="w-full md:w-56"
                >
                  <GlassCard interactive className="text-center">
                    <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand glow-brand">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Step {i + 1}
                    </div>
                    <div className="mt-1 text-sm font-medium">{s.label}</div>
                  </GlassCard>
                </motion.div>
                {i < workflowSteps.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center md:h-auto md:w-8">
                    <div className="h-8 w-px bg-gradient-to-b from-brand-blue via-brand-purple to-brand-cyan md:h-px md:w-8 md:bg-gradient-to-r animate-pulse-glow" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingTech() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Technology"
          title={
            <>
              Built on a <span className="text-gradient-brand">modern AI stack</span>
            </>
          }
          desc="Best-in-class open source AI infrastructure, wrapped in an enterprise-grade experience."
        />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {techBadges.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass-panel rounded-full px-4 py-2 text-sm text-foreground/90 transition hover:border-white/25 hover:text-white"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-brand align-middle" />
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <GlassCard strong className="relative overflow-hidden p-10 text-center md:p-16">
          <div className="absolute -top-40 left-1/2 h-96 w-[45rem] -translate-x-1/2 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-brand-cyan" />
              Deploy in minutes
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Ready to Experience{" "}
              <span className="text-gradient-brand">Enterprise AI Support?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Launch the SupportMind AI dashboard and see grounded, evaluated,
              production-quality AI responses for your customer support.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-gradient-brand px-6 text-white shadow-xl glow-brand-lg hover:opacity-95"
              >
                <Link to="/dashboard">
                  Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/15 bg-white/5 px-6"
              >
                <a href="#features">
                  <ScrollText className="mr-2 h-4 w-4" /> Read docs
                </a>
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-brand">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-medium">SupportMind AI</span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#workflow" className="hover:text-foreground">Workflow</a>
          <a href="#about" className="hover:text-foreground">About</a>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">{desc}</p>
    </div>
  );
}
