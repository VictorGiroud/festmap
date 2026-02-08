"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useFestivals } from "@/hooks/useFestivals";
import { FilterBar } from "@/components/filters/FilterBar";
import { ShareButton } from "@/components/ui/ShareButton";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { GENRE_COLORS, COUNTRY_FLAGS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { Festival, FestivalDataset } from "@/lib/types";

const MONTHS = [
  { key: 5, label: "Mai" },
  { key: 6, label: "Juin" },
  { key: 7, label: "Juillet" },
  { key: 8, label: "Août" },
  { key: 9, label: "Septembre" },
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface Props {
  dataset: FestivalDataset;
}

export function CalendarView({ dataset }: Props) {
  const { festivals, totalCount, allCount } = useFestivals(dataset);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Festival count per day for the selected month
  const dayCounts = useMemo(() => {
    const daysInMonth = new Date(2026, selectedMonth, 0).getDate();
    const counts = new Array(daysInMonth + 1).fill(0);

    for (const f of festivals) {
      const start = parseLocalDate(f.startDate);
      const end = parseLocalDate(f.endDate);
      const monthStart = new Date(2026, selectedMonth - 1, 1);
      const monthEnd = new Date(2026, selectedMonth, 0);

      if (start > monthEnd || end < monthStart) continue;

      const dayStart = Math.max(
        1,
        start.getMonth() + 1 === selectedMonth ? start.getDate() : 1
      );
      const dayEnd = Math.min(
        daysInMonth,
        end.getMonth() + 1 === selectedMonth ? end.getDate() : daysInMonth
      );

      for (let d = dayStart; d <= dayEnd; d++) {
        counts[d]++;
      }
    }

    return counts;
  }, [festivals, selectedMonth]);

  const maxDayCount = useMemo(() => Math.max(...dayCounts, 1), [dayCounts]);

  // Festivals visible in the list (month + optional day filter)
  const visibleFestivals = useMemo(() => {
    const monthStart = new Date(2026, selectedMonth - 1, 1);
    const monthEnd = new Date(2026, selectedMonth, 0);

    let filtered = festivals.filter((f) => {
      const start = parseLocalDate(f.startDate);
      const end = parseLocalDate(f.endDate);
      return start <= monthEnd && end >= monthStart;
    });

    if (selectedDay !== null) {
      const dayDate = new Date(2026, selectedMonth - 1, selectedDay);
      filtered = filtered.filter((f) => {
        const start = parseLocalDate(f.startDate);
        const end = parseLocalDate(f.endDate);
        return dayDate >= start && dayDate <= end;
      });
    }

    return filtered.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [festivals, selectedMonth, selectedDay]);

  // Festival count per month (for tab badges)
  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const m of MONTHS) {
      const monthStart = new Date(2026, m.key - 1, 1);
      const monthEnd = new Date(2026, m.key, 0);
      counts[m.key] = festivals.filter((f) => {
        const start = parseLocalDate(f.startDate);
        const end = parseLocalDate(f.endDate);
        return start <= monthEnd && end >= monthStart;
      }).length;
    }
    return counts;
  }, [festivals]);

  const monthGrid = useMemo(
    () => getMonthGrid(2026, selectedMonth),
    [selectedMonth]
  );
  const currentMonthLabel = MONTHS.find((m) => m.key === selectedMonth)!.label;

  return (
    <>
      <FilterBar />

      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-text-muted">
          {totalCount === allCount
            ? `${totalCount} festivals`
            : `${totalCount} / ${allCount} festivals`}
        </p>
        <ShareButton />
      </div>

      {/* Month tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {MONTHS.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setSelectedMonth(m.key);
              setSelectedDay(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-heading text-sm tracking-wider transition-all whitespace-nowrap ${
              selectedMonth === m.key
                ? "bg-neon-pink/15 text-neon-pink border border-neon-pink/30"
                : "text-text-muted hover:text-text-primary border border-border-subtle hover:border-text-muted/30"
            }`}
          >
            {m.label}
            {monthCounts[m.key] > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  selectedMonth === m.key
                    ? "bg-neon-pink/20 text-neon-pink"
                    : "bg-bg-elevated text-text-muted"
                }`}
              >
                {monthCounts[m.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Calendar grid + festival list */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-8">
        {/* Calendar grid */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-heading text-xs tracking-wider text-text-secondary mb-4 text-center uppercase">
            {currentMonthLabel} 2026
          </h3>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Weekday headers */}
            {WEEKDAYS.map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] font-mono text-text-muted py-1"
              >
                {d}
              </div>
            ))}

            {/* Day cells */}
            {monthGrid.map((day, i) => {
              if (day === null)
                return <div key={`empty-${i}`} className="aspect-square" />;

              const count = dayCounts[day];
              const isSelected = selectedDay === day;
              const intensity = count === 0 ? 0 : Math.min(count / maxDayCount, 1);

              return (
                <button
                  key={day}
                  onClick={() =>
                    count > 0
                      ? setSelectedDay(isSelected ? null : day)
                      : undefined
                  }
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                    isSelected
                      ? "ring-1 ring-neon-pink text-neon-pink"
                      : count > 0
                        ? "hover:ring-1 hover:ring-neon-pink/40 cursor-pointer text-text-primary"
                        : "text-text-muted/40 cursor-default"
                  }`}
                  style={
                    count > 0
                      ? {
                          backgroundColor: `rgba(255, 45, 106, ${0.05 + intensity * 0.2})`,
                        }
                      : undefined
                  }
                >
                  <span className="font-mono">{day}</span>
                  {count > 0 && (
                    <span className="text-[8px] font-mono text-neon-cyan mt-0.5">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "rgba(255,45,106,0.08)" }}
              />
              <span className="text-[9px] text-text-muted">Peu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "rgba(255,45,106,0.15)" }}
              />
              <span className="text-[9px] text-text-muted">Moyen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "rgba(255,45,106,0.25)" }}
              />
              <span className="text-[9px] text-text-muted">Beaucoup</span>
            </div>
          </div>
        </div>

        {/* Festival list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm tracking-wider text-text-primary">
              {selectedDay !== null ? (
                <>
                  <span className="text-neon-pink">{selectedDay}</span>{" "}
                  {currentMonthLabel}
                </>
              ) : (
                currentMonthLabel
              )}
              <span className="text-text-muted ml-2 text-xs font-mono">
                {visibleFestivals.length} festival
                {visibleFestivals.length !== 1 ? "s" : ""}
              </span>
            </h3>

            {selectedDay !== null && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs font-mono text-text-muted hover:text-neon-cyan transition-colors"
              >
                Voir tout le mois
              </button>
            )}
          </div>

          <div className="space-y-2">
            {visibleFestivals.map((festival) => (
              <FestivalRow key={festival.id} festival={festival} />
            ))}

            {visibleFestivals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted font-mono text-sm">
                  {selectedDay !== null
                    ? "Aucun festival ce jour"
                    : "Aucun festival ce mois-ci"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FestivalRow({ festival }: { festival: Festival }) {
  const primaryColor = GENRE_COLORS[festival.genres[0] ?? "other"];
  const startDate = parseLocalDate(festival.startDate);

  return (
    <Link
      href={`/festivals/${festival.slug}`}
      className="group flex items-center gap-4 p-3 rounded-lg border border-border-subtle hover:border-neon-pink/20 bg-bg-card/50 hover:bg-bg-elevated/50 transition-all"
    >
      {/* Date badge */}
      <div
        className="flex-none w-12 h-12 rounded-lg flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: `${primaryColor}15`,
          borderLeft: `2px solid ${primaryColor}`,
        }}
      >
        <span className="text-xs font-bold" style={{ color: primaryColor }}>
          {startDate.getDate()}
        </span>
        <span className="text-[9px] text-text-muted font-mono">
          {startDate.toLocaleDateString("fr-FR", { month: "short" })}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-text-primary group-hover:text-neon-pink transition-colors truncate">
          {festival.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] font-mono text-neon-cyan">
            {formatDateRange(festival.startDate, festival.endDate)}
          </span>
          <span className="text-text-muted text-[11px]">
            {COUNTRY_FLAGS[festival.venue.country]} {festival.venue.city}
          </span>
        </div>
      </div>

      {/* Genre badges */}
      <div className="hidden sm:flex gap-1 flex-none">
        {festival.genres.slice(0, 2).map((g) => (
          <NeonBadge key={g} genre={g} />
        ))}
      </div>
    </Link>
  );
}
