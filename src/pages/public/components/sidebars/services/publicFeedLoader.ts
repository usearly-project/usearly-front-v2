import { getPublicFeed } from "@src/services/feedbackService";
import type { PublicReport, Suggestion } from "@src/types/Reports";

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

export const loadAllReports = async (): Promise<PublicReport[]> => {
  let cursor: string | undefined;
  const seen = new Set<string>();
  const map = new Map<string, PublicReport>();
  let page = 0;

  while (true) {
    if (page >= MAX_PAGES) break;

    if (cursor && seen.has(cursor)) break;
    if (cursor) seen.add(cursor);

    const res = await getPublicFeed(PAGE_SIZE, cursor);

    res.data.forEach((item: any) => {
      if (item.type === "report") {
        map.set(item.reportingId, item);
      }
    });

    if (!res.nextCursor) break;

    cursor = res.nextCursor;
    page++;
  }

  return Array.from(map.values());
};

export const loadAllSuggestions = async (): Promise<Suggestion[]> => {
  let cursor: string | undefined;
  const seen = new Set<string>();
  const map = new Map<string, Suggestion>();
  let page = 0;

  while (true) {
    if (page >= MAX_PAGES) break;

    if (cursor && seen.has(cursor)) break;
    if (cursor) seen.add(cursor);

    const res = await getPublicFeed(PAGE_SIZE, cursor);

    res.data.forEach((item: any) => {
      if (item.type === "suggestion") {
        map.set(item.id, item);
      }
    });

    if (!res.nextCursor) break;

    cursor = res.nextCursor;
    page++;
  }

  return Array.from(map.values());
};
