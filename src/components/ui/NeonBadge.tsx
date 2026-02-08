import { cn } from "@/lib/utils";
import { GENRE_COLORS, GENRE_LABELS } from "@/lib/constants";
import type { Genre } from "@/lib/types";

interface NeonBadgeProps {
  genre: Genre;
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
}

export function NeonBadge({ genre, size = "sm", onClick, active }: NeonBadgeProps) {
  const color = GENRE_COLORS[genre];
  const label = GENRE_LABELS[genre];

  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border font-mono uppercase tracking-wider",
        "transition-all duration-200",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        onClick && "cursor-pointer hover:scale-105 active:scale-95"
      )}
      style={{
        color: color,
        borderColor: active ? color : `${color}40`,
        backgroundColor: active ? `${color}20` : `${color}08`,
        boxShadow: active ? `0 0 8px ${color}40` : "none",
      }}
    >
      {label}
    </Component>
  );
}
