import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "pink" | "cyan" | "violet" | "none";
  hover?: boolean;
}

const glowStyles = {
  pink: "hover:shadow-[0_0_20px_rgba(255,45,106,0.15)]",
  cyan: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  violet: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  none: "",
};

export function GlowCard({
  children,
  className,
  glowColor = "pink",
  hover = true,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-bg-card border border-border-subtle overflow-hidden",
        "transition-all duration-300",
        hover && "hover:border-neon-pink/30 hover:-translate-y-0.5",
        hover && glowStyles[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}
