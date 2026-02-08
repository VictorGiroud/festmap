"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useFilters } from "@/hooks/useFilters";

export function GimsOverlay() {
  const { filters } = useFilters();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevGims = useRef(filters.gims);

  useEffect(() => {
    if (filters.gims && !prevGims.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 7500);
      return () => clearTimeout(timer);
    }
    prevGims.current = filters.gims;
  }, [filters.gims]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fireConfetti = useCallback(() => {
    const duration = 6000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff2d6a", "#a855f7", "#ffd700", "#00f0ff"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff2d6a", "#a855f7", "#ffd700", "#00f0ff"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(fireConfetti, 400);

      // Play Gims sound clip (place your MP3 at public/sounds/gims.mp3)
      const audio = new Audio("/sounds/gims.mp3");
      audio.volume = 0.6;
      audioRef.current = audio;
      audio.play().catch(() => {});

      return () => {
        clearTimeout(timer);
        // Fade out & stop audio when overlay closes
        if (audioRef.current) {
          const a = audioRef.current;
          const fade = setInterval(() => {
            if (a.volume > 0.05) {
              a.volume = Math.max(0, a.volume - 0.1);
            } else {
              clearInterval(fade);
              a.pause();
              a.currentTime = 0;
            }
          }, 50);
        }
      };
    }
  }, [isAnimating, fireConfetti]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 pointer-events-none"
        >
          {/* Gims face with sunglasses */}
          <motion.div
            initial={{ scale: 0.2, y: 300, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.1, y: -300, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 100,
              duration: 0.6,
            }}
            className="relative"
          >
            {/* Glow ring around the image */}
            <div className="absolute inset-0 rounded-full glow-pink-lg animate-glow-pulse" />

            {/* Sunglasses emoji as placeholder (replace with actual image) */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-bg-elevated border-2 border-neon-pink flex items-center justify-center glow-pink overflow-hidden">
              <span className="text-8xl md:text-9xl">{"🕶️"}</span>
            </div>
          </motion.div>

          {/* Neon text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl text-neon-pink text-glow-pink animate-neon-flicker tracking-widest">
              🕶️ LE MAITRE 🕶️
            </h2>
            <p className="font-mono text-neon-cyan text-sm mt-2 tracking-wider animate-glow-pulse">
              MODE GIMS ACTIVÉ
            </p>
          </motion.div>

          {/* Radiating rings — repeating waves */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{ scale: 2.5 + i, opacity: 0 }}
              transition={{
                duration: 2.5,
                delay: 0.3 + i * 0.2,
                ease: "easeOut",
                repeat: 2,
                repeatDelay: 0.5,
              }}
              className="absolute w-48 h-48 rounded-full border border-neon-pink/40"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
