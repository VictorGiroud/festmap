import Link from "next/link";
import { getCachedDataset } from "@/lib/data/cache";
import { NeonBadge } from "@/components/ui/NeonBadge";
import type { Genre } from "@/lib/types";

export const revalidate = 3600;

export default async function HomePage() {
  const dataset = await getCachedDataset();
  const count = dataset?.totalCount ?? 0;

  const topGenres = dataset
    ? (Object.entries(dataset.genreCounts) as [Genre, number][])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([genre]) => genre)
    : [];

  const monthDistribution = [5, 6, 7, 8, 9].map((month) => {
    const monthCount =
      dataset?.festivals.filter((f) => {
        const startMonth = parseInt(f.startDate.slice(5, 7));
        const endMonth = parseInt(f.endDate.slice(5, 7));
        return startMonth <= month && endMonth >= month;
      }).length ?? 0;
    return { month, count: monthCount };
  });
  const maxMonthCount = Math.max(...monthDistribution.map((m) => m.count), 1);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/3 rounded-full blur-[150px] pointer-events-none" />

      <div
        className="relative z-10 w-full max-w-4xl mx-auto"
        style={{ animation: "slide-up 0.8s ease-out" }}
      >
        <p className="font-mono text-neon-cyan text-sm tracking-[0.3em] uppercase mb-4 animate-glow-pulse">
          {"🎵"} Été 2026
        </p>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider leading-tight mb-6">
          <span className="text-neon-pink text-glow-pink">FEST</span>
          <span className="text-text-primary">MAP</span>
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-3 leading-relaxed">
          Tous les festivals de musique en{" "}
          <span className="text-neon-cyan">France</span> et en{" "}
          <span className="text-neon-violet">Europe</span> pour l&apos;été 2026
        </p>

        {count > 0 && (
          <p className="font-mono text-neon-amber text-sm mb-10">
            {count} festivals référencés
          </p>
        )}

        {/* Feature blocks — replace CTA buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* Par genre */}
          <Link href="/festivals" className="group">
            <div className="glass rounded-xl p-4 h-full transition-all duration-300 hover:border-neon-pink/30 hover:shadow-[0_0_30px_rgba(255,45,106,0.1)]">
              <div className="flex flex-wrap gap-1 mb-3 justify-center">
                {topGenres.map((genre) => (
                  <NeonBadge key={genre} genre={genre} />
                ))}
              </div>
              <h3 className="font-heading text-xs tracking-wider text-text-primary mb-1 group-hover:text-neon-pink transition-colors">
                Par genre
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Filtre par style musical
              </p>
            </div>
          </Link>

          {/* Sur la carte */}
          <Link href="/map" className="group">
            <div className="glass rounded-xl p-4 h-full transition-all duration-300 hover:border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <div className="relative h-16 mb-3 rounded-lg bg-bg-secondary/50 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                {[
                  { top: "30%", left: "45%", color: "#ff2d6a", size: 7 },
                  { top: "55%", left: "32%", color: "#00f0ff", size: 5 },
                  { top: "22%", left: "58%", color: "#a855f7", size: 6 },
                  { top: "60%", left: "55%", color: "#ff2d6a", size: 4 },
                  { top: "18%", left: "28%", color: "#00f0ff", size: 5 },
                  { top: "45%", left: "65%", color: "#a855f7", size: 4 },
                  { top: "40%", left: "30%", color: "#ffb800", size: 4 },
                  { top: "70%", left: "42%", color: "#22c55e", size: 4 },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-glow-pulse"
                    style={{
                      top: dot.top,
                      left: dot.left,
                      width: dot.size,
                      height: dot.size,
                      backgroundColor: dot.color,
                      boxShadow: `0 0 ${dot.size * 2}px ${dot.color}80`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}
              </div>
              <h3 className="font-heading text-xs tracking-wider text-text-primary mb-1 group-hover:text-neon-cyan transition-colors">
                Sur la carte
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Carte interactive de l&apos;Europe
              </p>
            </div>
          </Link>

          {/* Par date */}
          <Link href="/calendar" className="group">
            <div className="glass rounded-xl p-4 h-full transition-all duration-300 hover:border-neon-violet/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="flex items-end gap-1.5 h-16 mb-3 px-1">
                {monthDistribution.map(({ month, count: monthCount }) => (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                  >
                    <div
                      className="w-full rounded-sm"
                      style={{
                        height: `${Math.max((monthCount / maxMonthCount) * 100, 10)}%`,
                        background:
                          "linear-gradient(to top, rgba(168,85,247,0.4), rgba(168,85,247,0.15))",
                        boxShadow:
                          monthCount > 0
                            ? "0 0 6px rgba(168,85,247,0.2)"
                            : "none",
                      }}
                    />
                    <span className="text-[8px] font-mono text-text-muted">
                      {["Mai", "Jui", "Jul", "Aoû", "Sep"][month - 5]}
                    </span>
                  </div>
                ))}
              </div>
              <h3 className="font-heading text-xs tracking-wider text-text-primary mb-1 group-hover:text-neon-violet transition-colors">
                Par date
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Agenda mois par mois
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </div>
  );
}
