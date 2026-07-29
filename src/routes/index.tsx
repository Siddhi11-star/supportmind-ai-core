import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import {
  LandingHero,
  LandingFeatures,
  LandingWorkflow,
  LandingTech,
  LandingCTA,
  LandingFooter,
} from "@/components/landing/LandingSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SupportMind AI — Enterprise LLM-Powered Customer Support" },
      {
        name: "description",
        content:
          "Automate customer support with LLMs, RAG, guardrails, and AI evaluation. Grounded, accurate, enterprise-ready responses at scale.",
      },
      { property: "og:title", content: "SupportMind AI — Enterprise AI Support" },
      {
        property: "og:description",
        content:
          "LLM + RAG + guardrails + evaluation for accurate, grounded customer support automation.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AnimatedBackground />
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingTech />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
