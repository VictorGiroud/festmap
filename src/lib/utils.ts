import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM yyyy", { locale: fr });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM", { locale: fr });
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);

  if (start === end) {
    return format(s, "d MMMM yyyy", { locale: fr });
  }

  if (s.getMonth() === e.getMonth()) {
    return `${format(s, "d", { locale: fr })} - ${format(e, "d MMMM yyyy", { locale: fr })}`;
  }

  return `${format(s, "d MMM", { locale: fr })} - ${format(e, "d MMM yyyy", { locale: fr })}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
