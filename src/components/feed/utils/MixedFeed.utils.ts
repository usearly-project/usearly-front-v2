import type { FeedItem } from "@src/types/feedItem";
import type {
  CdcFeedFilterValue,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "../types/feedFilterTypes";

// --- TYPES INTERNES ---
export type ReportFeedItem = Extract<FeedItem, { type: "report" }>;
export type CdcFeedItem = Extract<FeedItem, { type: "cdc" }>;
export type SuggestionFeedItem = Extract<FeedItem, { type: "suggestion" }>;

const NEGATIVE_EMOJIS = new Set(["😡", "😤", "🤬", "😠", "😒", "😞", "💢"]);

// --- HELPERS DE CALCUL ---

export const getTimestamp = (
  ...values: Array<string | null | undefined>
): number => {
  for (const value of values) {
    if (!value) continue;
    const parsed = new Date(value).getTime();
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
};

export const getReactionTotal = (reactions?: Array<{ count: number }>) =>
  (reactions ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0);

export const getReactionBuckets = (reactions?: Array<{ count: number }>) =>
  (reactions ?? []).filter((r) => (r.count ?? 0) > 0).length;

const getReportRageScore = (item: ReportFeedItem) => {
  const emojis = [item.data.emoji, ...item.data.reporters.map((r) => r.emoji)];
  const negativeCount = emojis.filter((e) => NEGATIVE_EMOJIS.has(e)).length;
  return (
    negativeCount * 5 + item.data.confirmationsCount + item.data.reportsCount
  );
};

const getReportPopularityScore = (item: ReportFeedItem) =>
  item.data.reportsCount * 3 +
  item.data.confirmationsCount * 2 +
  (item.data.solutionsCount ?? 0) * 2 +
  (item.data.hasBrandResponse ? 3 : 0);

// --- FONCTIONS DE TRI (LOGIQUE MÉTIER) ---

export const sortReportsByFilter = (
  items: ReportFeedItem[],
  filter: ReportFeedFilterValue,
) => {
  return [...items].sort((a, b) => {
    const timeA = getTimestamp(a.data.latestActivityAt, a.data.createdAt);
    const timeB = getTimestamp(b.data.latestActivityAt, b.data.createdAt);

    if (filter === "hot") {
      return (
        b.data.reportsCount - a.data.reportsCount ||
        b.data.confirmationsCount - a.data.confirmationsCount ||
        timeB - timeA
      );
    }
    if (filter === "rage") {
      return (
        getReportRageScore(b) - getReportRageScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        timeB - timeA
      );
    }
    if (filter === "popular") {
      return (
        getReportPopularityScore(b) - getReportPopularityScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        timeB - timeA
      );
    }
    return timeB - timeA;
  });
};

export const sortCdcByFilter = (
  items: CdcFeedItem[],
  filter: CdcFeedFilterValue,
) => {
  return [...items].sort((a, b) => {
    const timeA = getTimestamp(a.data.updatedAt, a.data.createdAt);
    const timeB = getTimestamp(b.data.updatedAt, b.data.createdAt);

    if (filter === "popular") {
      return (
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) || timeB - timeA
      );
    }
    if (filter === "enflammes") {
      return (
        getReactionBuckets(b.data.reactions) -
          getReactionBuckets(a.data.reactions) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        timeB - timeA
      );
    }
    return timeB - timeA;
  });
};

export const sortSuggestionsByFilter = (
  items: SuggestionFeedItem[],
  filter: SuggestionFeedFilterValue,
) => {
  const filtered =
    filter === "recentSuggestion"
      ? items.filter((i) => !i.data.isAdopted)
      : filter === "likedSuggestion"
        ? items.filter((i) => !!i.data.isAdopted)
        : items;

  return [...filtered].sort((a, b) => {
    const timeA = getTimestamp(a.data.createdAt, a.data.updatedAt);
    const timeB = getTimestamp(b.data.createdAt, b.data.updatedAt);

    if (filter === "allSuggest") {
      return (
        (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
        (b.data.duplicateCount ?? 0) - (a.data.duplicateCount ?? 0) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        timeB - timeA
      );
    }
    if (filter === "recentSuggestion") {
      return timeB - timeA || (b.data.votes ?? 0) - (a.data.votes ?? 0);
    }
    return (
      (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
      getReactionTotal(b.data.reactions) - getReactionTotal(a.data.reactions) ||
      timeB - timeA
    );
  });
};

export const getItemId = (item: any): string => {
  if (item.type === "report") return item.data.reportingId;
  return item.data.id || item.data.title || "no-id";
};
