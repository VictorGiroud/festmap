"use client";

import { cn } from "@/lib/utils";

type Variant = "pink" | "cyan" | "violet";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const variantStyles: Record<Variant, string> = {
  pink: "border-neon-pink text-neon-pink hover:bg-neon-pink/10 glow-pink",
  cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 glow-cyan",
  violet: "border-neon-violet text-neon-violet hover:bg-neon-violet/10 glow-violet",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export function NeonButton({
  children,
  variant = "pink",
  onClick,
  href,
  className,
  size = "md",
  disabled,
}: NeonButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border font-heading uppercase tracking-wider",
    "transition-all duration-200 active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
