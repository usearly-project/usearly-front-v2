import { useEffect, useState } from "react";
import {
  getPopularReports,
  getPublicCoupsDeCoeur,
  getPublicFeed,
  getRageReports,
  getRightSidebarStats,
} from "@src/services/feedbackService";
import { getPopularCoupsDeCoeur } from "@src/services/coupDeCoeurService";
import { fetchReactions as fetchReportReactions } from "@src/services/reactionService";
import type {
  CoupDeCoeur,
  PopularReport,
  Suggestion,
} from "@src/types/Reports";
import type {
  RightSidebarStatItem,
  RightSidebarStatsMode,
} from "./rightSidebarTypes";

type RightSidebarDefaultStatsResponse = {
  totalReports: number;
  totalTickets: number;
};

type PaginatedPopularReportResponse = {
  totalPages?: number;
  data?: PopularReport[];
};

type PaginatedCdcResponse = {
  totalPages?: number;
  coupdeCoeurs?: CoupDeCoeur[];
};

type PublicFeedRecord =
  | { type: "report" }
  | { type: "cdc" }
  | (Omit<Suggestion, "type"> & { type: "suggestion" });

type PublicFeedResponse = {
  data: PublicFeedRecord[];
  nextCursor?: string | null;
};

const PAGE_SIZE = 100;
const REPORT_REACTION_BATCH_SIZE = 10;
const LAST_48_HOURS_IN_MS = 48 * 60 * 60 * 1000;

const getReactionTotal = (
  reactions?: Array<{ count?: number; userIds?: string[] }>,
) =>
  (reactions ?? []).reduce(
    (sum, reaction) => sum + (reaction.count ?? reaction.userIds?.length ?? 0),
    0,
  );

const loadPaginatedItems = async <T, TResponse>({
  fetchPage,
  getItems,
  getTotalPages,
  getKey,
}: {
  fetchPage: (page: number, limit: number) => Promise<TResponse>;
  getItems: (response: TResponse) => T[];
  getTotalPages: (response: TResponse) => number;
  getKey: (item: T) => string;
}) => {
  const firstPage = await fetchPage(1, PAGE_SIZE);
  const totalPages = Math.max(getTotalPages(firstPage), 1);
  const items = [...getItems(firstPage)];

  if (totalPages > 1) {
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        fetchPage(index + 2, PAGE_SIZE),
      ),
    );

    remainingPages.forEach((page) => {
      items.push(...getItems(page));
    });
  }

  return Array.from(
    new Map(items.map((item) => [getKey(item), item])).values(),
  );
};

const loadAllPublicFeedSuggestions = async (): Promise<Suggestion[]> => {
  let cursor: string | undefined;
  const suggestions: Suggestion[] = [];

  while (true) {
    const response = (await getPublicFeed(
      PAGE_SIZE,
      cursor,
    )) as PublicFeedResponse;

    suggestions.push(
      ...response.data
        .filter((item) => item.type === "suggestion")
        .map((item) => ({
          ...item,
          type: "suggestion" as const,
        })),
    );

    if (!response.nextCursor) {
      break;
    }

    cursor = response.nextCursor;
  }

  return Array.from(
    new Map(suggestions.map((item) => [item.id, item])).values(),
  );
};

const loadDefaultStats = async (): Promise<RightSidebarStatItem[]> => {
  const data =
    (await getRightSidebarStats()) as RightSidebarDefaultStatsResponse;

  return [
    {
      value: data.totalReports,
      singular: "signalement",
      plural: "signalements",
      suffix: "dans les dernières 48h",
    },
    {
      value: data.totalTickets,
      singular: "problème",
      plural: "problèmes",
      suffix: "très signalés en ce moment",
    },
  ];
};

const loadReportRageStats = async (): Promise<RightSidebarStatItem[]> => {
  const reports = await loadPaginatedItems({
    fetchPage: getRageReports,
    getItems: (response) => response.data ?? [],
    getTotalPages: (response) =>
      Math.ceil(Math.max(response.total, response.data.length) / PAGE_SIZE),
    getKey: (report) => String(report.reportingId),
  });

  const reactingUserIds = new Set<string>();
  const reportIds = reports.map((report) => String(report.reportingId));

  for (
    let index = 0;
    index < reportIds.length;
    index += REPORT_REACTION_BATCH_SIZE
  ) {
    const reactionBatch = await Promise.all(
      reportIds
        .slice(index, index + REPORT_REACTION_BATCH_SIZE)
        .map((reportId) => fetchReportReactions(reportId).catch(() => [])),
    );

    reactionBatch.flat().forEach((reaction) => {
      if (reaction.userId) {
        reactingUserIds.add(reaction.userId);
      }
    });
  }

  return [
    {
      value: reactingUserIds.size,
      singular: "utilisateur",
      plural: "utilisateurs",
      suffix: "ont réagi aux publications de cette sélection",
    },
    {
      value: reports.length,
      singular: "problème",
      plural: "problèmes",
      suffix: "sont remontés dans le filtre rage",
    },
  ];
};

const loadReportPopularStats = async (): Promise<RightSidebarStatItem[]> => {
  const reports = await loadPaginatedItems({
    fetchPage: (page, limit) =>
      getPopularReports(page, limit) as Promise<PaginatedPopularReportResponse>,
    getItems: (response) => response.data ?? [],
    getTotalPages: (response) => response.totalPages ?? 1,
    getKey: (report) =>
      report.id || `${report.reportingId}-${report.subCategory}`,
  });

  const totals = reports.reduce(
    (acc, report) => ({
      totalReactions: acc.totalReactions + (report.stats?.totalReactions ?? 0),
      totalComments: acc.totalComments + (report.stats?.totalComments ?? 0),
    }),
    { totalReactions: 0, totalComments: 0 },
  );

  return [
    {
      value: totals.totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "au total sur les publications populaires",
    },
    {
      value: totals.totalComments,
      singular: "commentaire",
      plural: "commentaires",
      suffix: "au total sur les publications populaires",
    },
  ];
};

const loadCdcPopularStats = async (): Promise<RightSidebarStatItem[]> => {
  const [popularCoupsDeCoeur, publicCoupsDeCoeur] = await Promise.all([
    loadPaginatedItems({
      fetchPage: getPopularCoupsDeCoeur,
      getItems: (response) => response.coupdeCoeurs ?? [],
      getTotalPages: (response) => response.totalPages ?? 1,
      getKey: (item) => item.id,
    }),
    loadPaginatedItems({
      fetchPage: (page, limit) =>
        getPublicCoupsDeCoeur(page, limit) as Promise<PaginatedCdcResponse>,
      getItems: (response) => response.coupdeCoeurs ?? [],
      getTotalPages: (response) => response.totalPages ?? 1,
      getKey: (item) => item.id,
    }),
  ]);

  const totalReactions = popularCoupsDeCoeur.reduce(
    (sum, item) => sum + getReactionTotal(item.reactions),
    0,
  );
  const recentThreshold = Date.now() - LAST_48_HOURS_IN_MS;
  const recentCount = publicCoupsDeCoeur.filter((item) => {
    const createdAt = new Date(item.createdAt).getTime();
    return !Number.isNaN(createdAt) && createdAt >= recentThreshold;
  }).length;

  return [
    {
      value: totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "au total sur les coups de cœur populaires",
    },
    {
      value: recentCount,
      singular: "coup de cœur récent",
      plural: "coups de cœur récents",
      suffix: "publiés sur les 48 dernières heures",
    },
  ];
};

const loadSuggestionPopularStats = async (): Promise<
  RightSidebarStatItem[]
> => {
  const suggestions = await loadAllPublicFeedSuggestions();

  const totals = suggestions.reduce(
    (acc, item) => ({
      totalVotes: acc.totalVotes + (item.votes ?? 0),
      totalReactions: acc.totalReactions + getReactionTotal(item.reactions),
      adoptedCount: acc.adoptedCount + (item.isAdopted ? 1 : 0),
    }),
    { totalVotes: 0, totalReactions: 0, adoptedCount: 0 },
  );

  return [
    {
      value: totals.totalVotes,
      singular: "vote",
      plural: "votes",
      suffix: "au total sur les suggestions populaires",
    },
    {
      value: totals.totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "au total sur les suggestions populaires",
    },
    {
      value: totals.adoptedCount,
      singular: "suggestion adoptée",
      plural: "suggestions adoptées",
    },
  ];
};

const RIGHT_SIDEBAR_STATS_LOADERS: Record<
  Exclude<RightSidebarStatsMode, "none">,
  () => Promise<RightSidebarStatItem[]>
> = {
  default: loadDefaultStats,
  "report-rage": loadReportRageStats,
  "report-popular": loadReportPopularStats,
  "cdc-popular": loadCdcPopularStats,
  "suggestion-popular": loadSuggestionPopularStats,
};

export const useRightSidebarStats = (mode: RightSidebarStatsMode) => {
  const [stats, setStats] = useState<RightSidebarStatItem[]>([]);
  const [loading, setLoading] = useState(mode !== "none");

  useEffect(() => {
    let isCancelled = false;

    if (mode === "none") {
      setStats([]);
      setLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    const loadStats = async () => {
      setLoading(true);

      try {
        const nextStats = await RIGHT_SIDEBAR_STATS_LOADERS[mode]();
        if (!isCancelled) {
          setStats(nextStats);
        }
      } catch (error) {
        console.error("Erreur de chargement des stats de la sidebar :", error);
        if (!isCancelled) {
          setStats([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isCancelled = true;
    };
  }, [mode]);

  return { loading, stats };
};
