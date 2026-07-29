import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
  strong?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow, interactive, strong, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl p-6",
          strong ? "glass-panel-strong" : "glass-panel",
          interactive &&
            "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_oklch(0.68_0.2_265_/_0.4)]",
          className,
        )}
        {...props}
      >
        {glow && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), oklch(0.68 0.2 265 / 0.15), transparent 40%)",
            }}
          />
        )}
        {props.children}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
