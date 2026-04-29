import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";

export function formatFullDate(dateInput: string | Date): string {
  if (!dateInput) return "Date inconnue";

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function compactRelativeDateLabel(label: string): string {
  return label
    .replace("environ ", "")
    .replace(/(\d+)\s+minutes?\b/gi, "$1 min")
    .replace(/(\d+)\s+heures?\b/gi, "$1 h")
    .replace(/(\d+)\s+jours?\b/gi, "$1j");
}

export function stripRelativePrefix(label: string): string {
  return label.replace(/^il y a\s+/i, "");
}

/**
 * Format relatif ultra propre
 * - enlève "environ"
 * - affiche "il y a 4j"
 */
export function formatRelative(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return "Date inconnue";

  return compactRelativeDateLabel(
    formatDistanceToNow(date, {
      locale: fr,
      addSuffix: true,
    }),
  );
}

export function formatRelativeStrict(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return "Date inconnue";

  return compactRelativeDateLabel(
    formatDistanceToNowStrict(date, {
      locale: fr,
    }),
  );
}

export const toDMY = (d: Date, sep = "/", useUTC = false) => {
  const y = useUTC ? d.getUTCFullYear() : d.getFullYear();
  const m = (useUTC ? d.getUTCMonth() : d.getMonth()) + 1;
  const day = useUTC ? d.getUTCDate() : d.getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}${sep}${pad(m)}${sep}${y}`; // 01/12/2025
};
