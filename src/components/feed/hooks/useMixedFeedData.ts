import { useMemo } from "react";
import type { FeedItem } from "@src/types/feedItem";
import { filterFeedItems } from "@src/utils/feedSearch";
import type {
  CdcFeedFilterValue,
  FeedFilterValue,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "../feedFilterTypes";
import {
  CDC_FILTER_LABELS,
  REPORT_FILTER_LABELS,
  SUGGESTION_FILTER_LABELS,
} from "../mixedFeedOptions";

type ReportFeedItem = Extract<FeedItem, { type: "report" }>;
type CdcFeedItem = Extract<FeedItem, { type: "cdc" }>;
type SuggestionFeedItem = Extract<FeedItem, { type: "suggestion" }>;

type Params = {
  feed: FeedItem[];
  searchValue: string;
  selectedFilter: FeedFilterValue;
  reportFeedFilter: ReportFeedFilterValue;
  cdcFeedFilter: CdcFeedFilterValue;
  suggestionFeedFilter: SuggestionFeedFilterValue;
};

const NEGATIVE_EMOJIS = new Set(["😡", "😤", "🤬", "😠", "😒", "😞", "💢"]);

const getTimestamp = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (!value) continue;

    const parsed = new Date(value).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const getReactionTotal = (
  reactions?: Array<{ count: number; userIds?: string[] }>,
) =>
  (reactions ?? []).reduce((sum, reaction) => sum + (reaction.count ?? 0), 0);

const getReactionBuckets = (
  reactions?: Array<{ count: number; userIds?: string[] }>,
) => (reactions ?? []).filter((reaction) => (reaction.count ?? 0) > 0).length;

const getReportRageScore = (item: ReportFeedItem) => {
  const emojis = [
    item.data.emoji,
    ...item.data.reporters.map((reporter) => reporter.emoji),
  ];
  const negativeCount = emojis.filter((emoji) =>
    NEGATIVE_EMOJIS.has(emoji),
  ).length;

  return (
    negativeCount * 5 + item.data.confirmationsCount + item.data.reportsCount
  );
};

const getReportPopularityScore = (item: ReportFeedItem) =>
  item.data.reportsCount * 3 +
  item.data.confirmationsCount * 2 +
  (item.data.solutionsCount ?? 0) * 2 +
  (item.data.hasBrandResponse ? 3 : 0);

const sortReportsByFilter = (
  items: ReportFeedItem[],
  filter: ReportFeedFilterValue,
) => {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (filter === "hot") {
      return (
        b.data.reportsCount - a.data.reportsCount ||
        b.data.confirmationsCount - a.data.confirmationsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    if (filter === "rage") {
      return (
        getReportRageScore(b) - getReportRageScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    if (filter === "popular") {
      return (
        getReportPopularityScore(b) - getReportPopularityScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    return (
      getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
      getTimestamp(a.data.latestActivityAt, a.data.createdAt)
    );
  });

  return sorted;
};

const sortCdcByFilter = (items: CdcFeedItem[], filter: CdcFeedFilterValue) => {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (filter === "popular") {
      return (
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.updatedAt, b.data.createdAt) -
          getTimestamp(a.data.updatedAt, a.data.createdAt)
      );
    }

    if (filter === "enflammes") {
      return (
        getReactionBuckets(b.data.reactions) -
          getReactionBuckets(a.data.reactions) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.updatedAt, b.data.createdAt) -
          getTimestamp(a.data.updatedAt, a.data.createdAt)
      );
    }

    return (
      getTimestamp(b.data.createdAt, b.data.updatedAt) -
      getTimestamp(a.data.createdAt, a.data.updatedAt)
    );
  });

  return sorted;
};

const sortSuggestionsByFilter = (
  items: SuggestionFeedItem[],
  filter: SuggestionFeedFilterValue,
) => {
  const filtered =
    filter === "recentSuggestion"
      ? items.filter((item) => !item.data.isAdopted)
      : filter === "likedSuggestion"
        ? items.filter((item) => Boolean(item.data.isAdopted))
        : items;

  const sorted = [...filtered];

  sorted.sort((a, b) => {
    if (filter === "allSuggest") {
      return (
        (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
        (b.data.duplicateCount ?? 0) - (a.data.duplicateCount ?? 0) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.createdAt, b.data.updatedAt) -
          getTimestamp(a.data.createdAt, a.data.updatedAt)
      );
    }

    if (filter === "recentSuggestion") {
      return (
        getTimestamp(b.data.createdAt, b.data.updatedAt) -
          getTimestamp(a.data.createdAt, a.data.updatedAt) ||
        (b.data.votes ?? 0) - (a.data.votes ?? 0)
      );
    }

    return (
      (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
      getReactionTotal(b.data.reactions) - getReactionTotal(a.data.reactions) ||
      getTimestamp(b.data.createdAt, b.data.updatedAt) -
        getTimestamp(a.data.createdAt, a.data.updatedAt)
    );
  });

  return sorted;
};

export const getFeedItemKey = (item: FeedItem) => {
  const id =
    item.type === "report"
      ? item.data.reportingId
      : (item.data.id ?? item.data.title ?? "unknown");

  return `${item.type}-${id}`;
};

export const useMixedFeedData = ({
  feed,
  searchValue,
  selectedFilter,
  reportFeedFilter,
  cdcFeedFilter,
  suggestionFeedFilter,
}: Params) => {
  const typeFilteredFeed = useMemo(() => {
    if (selectedFilter === "all") {
      return feed;
    }

    return feed.filter((item) =>
      selectedFilter === "coupdecoeur"
        ? item.type === "cdc"
        : item.type === selectedFilter,
    );
  }, [feed, selectedFilter]);

  const publicationFilteredFeed = useMemo(() => {
    if (selectedFilter === "report") {
      return sortReportsByFilter(
        typeFilteredFeed.filter(
          (item): item is ReportFeedItem => item.type === "report",
        ),
        reportFeedFilter,
      );
    }

    if (selectedFilter === "coupdecoeur") {
      return sortCdcByFilter(
        typeFilteredFeed.filter(
          (item): item is CdcFeedItem => item.type === "cdc",
        ),
        cdcFeedFilter,
      );
    }

    if (selectedFilter === "suggestion") {
      return sortSuggestionsByFilter(
        typeFilteredFeed.filter(
          (item): item is SuggestionFeedItem => item.type === "suggestion",
        ),
        suggestionFeedFilter,
      );
    }

    return typeFilteredFeed;
  }, [
    cdcFeedFilter,
    reportFeedFilter,
    selectedFilter,
    suggestionFeedFilter,
    typeFilteredFeed,
  ]);

  const filteredFeed = useMemo(
    () => filterFeedItems(publicationFilteredFeed, searchValue),
    [publicationFilteredFeed, searchValue],
  );

  const activeSecondaryFilterLabel = useMemo(() => {
    if (selectedFilter === "report") {
      return REPORT_FILTER_LABELS[reportFeedFilter];
    }

    if (selectedFilter === "coupdecoeur") {
      return CDC_FILTER_LABELS[cdcFeedFilter];
    }

    if (selectedFilter === "suggestion") {
      return SUGGESTION_FILTER_LABELS[suggestionFeedFilter];
    }

    return "";
  }, [cdcFeedFilter, reportFeedFilter, selectedFilter, suggestionFeedFilter]);

  return {
    filteredFeed,
    hasSearchQuery: Boolean(searchValue.trim()),
    hasTypeFilter: selectedFilter !== "all",
    activeSecondaryFilterLabel,
  };
};
