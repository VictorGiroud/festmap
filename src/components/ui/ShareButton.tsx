"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    // Try native share on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FestMap 2026",
          url,
        });
        return;
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "border border-border-subtle text-text-secondary text-sm font-mono",
        "transition-all duration-200",
        "hover:border-neon-cyan/50 hover:text-neon-cyan",
        copied && "border-neon-green/50 text-neon-green",
        className
      )}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Lien copié !
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16,6 12,2 8,6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Partager
        </>
      )}
    </button>
  );
}
