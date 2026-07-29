import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SupportMind AI" },
      { name: "description", content: "SupportMind AI enterprise support console." },
      { property: "og:title", content: "SupportMind AI Dashboard" },
      {
        property: "og:description",
        content: "Enterprise console for LLM-powered customer support intelligence.",
      },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <DashboardShell />
    </div>
  );
}
