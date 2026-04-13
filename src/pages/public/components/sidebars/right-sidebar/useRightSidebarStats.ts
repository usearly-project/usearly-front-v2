import { useEffect, useState } from "react";
import {
  getPopularReports,
  getPublicCoupsDeCoeur,
  getPublicFeed,
  getRageReports,
  // getGroupedReportsByHot,
  getRightSidebarStats,
} from "@src/services/feedbackService";
import {
  getEnflammesCoupsDeCoeur,
  getPopularCoupsDeCoeur,
} from "@src/services/coupDeCoeurService";
// import { fetchReactions as fetchReportReactions } from "@src/services/reactionService";
import type {
  CoupDeCoeur,
  // PopularGroupedReport,
  PopularReport,
  PublicReport,
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

// Ancienne tentative via /reportings/grouped-by-hot gardée en commentaire :
// type PaginatedHotReportResponse = {
//   data?: Record<string, PopularGroupedReport[]> | PopularGroupedReport[];
//   totalPages?: number;
// };

type PaginatedPopularReportResponse = {
  totalPages?: number;
  data?: PopularReport[];
};

type PaginatedCdcResponse = {
  totalPages?: number;
  coupdeCoeurs?: CoupDeCoeur[];
};

type PublicFeedRecord =
  | (PublicReport & { type: "report" })
  | { type: "cdc" }
  | (Omit<Suggestion, "type"> & { type: "suggestion" });

type PublicFeedResponse = {
  data: PublicFeedRecord[];
  nextCursor?: string | null;
};

const PAGE_SIZE = 100;
// const REPORT_REACTION_BATCH_SIZE = 10;
const LAST_24_HOURS_IN_MS = 24 * 60 * 60 * 1000;
const LAST_48_HOURS_IN_MS = 48 * 60 * 60 * 1000;
const HOT_REACTION_THRESHOLD = 2;

const getSafeNumber = (value: unknown) => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  return Number.isFinite(numberValue) ? numberValue : 0;
};

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

const loadAllPublicFeedReports = async (): Promise<PublicReport[]> => {
  let cursor: string | undefined;
  const reports = new Map<string, PublicReport>();

  while (true) {
    const response = (await getPublicFeed(
      PAGE_SIZE,
      cursor,
    )) as PublicFeedResponse;

    response.data.forEach((item) => {
      if (item.type === "report") {
        reports.set(item.reportingId, item);
      }
    });

    if (!response.nextCursor) {
      break;
    }

    cursor = response.nextCursor;
  }

  return Array.from(reports.values());
};

const getPublicReportReactionScore = (report: PublicReport) =>
  getSafeNumber(report.reportsCount) + getSafeNumber(report.confirmationsCount);

const isPublicReportCreatedInLast24Hours = (report: PublicReport) => {
  const createdAt = new Date(report.createdAt).getTime();
  return (
    !Number.isNaN(createdAt) && createdAt >= Date.now() - LAST_24_HOURS_IN_MS
  );
};

// Ancienne tentative via /reportings/grouped-by-hot gardée en commentaire :
// const getHotReportItems = (
//   response: PaginatedHotReportResponse,
// ): PopularGroupedReport[] => {
//   if (!response.data) {
//     return [];
//   }
//
//   return Array.isArray(response.data)
//     ? response.data
//     : Object.values(response.data).flat();
// };
//
// const loadAllHotReports = async (): Promise<PopularGroupedReport[]> => {
//   const reportMap = new Map<string, PopularGroupedReport>();
//   let page = 1;
//
//   while (true) {
//     const response = (await getGroupedReportsByHot(
//       page,
//       PAGE_SIZE,
//     )) as PaginatedHotReportResponse;
//     const reports = getHotReportItems(response);
//
//     reports.forEach((report) => {
//       const key = `${report.reportingId}-${report.subCategory}`;
//       const existing = reportMap.get(key);
//
//       if (!existing) {
//         reportMap.set(key, report);
//         return;
//       }
//
//       reportMap.set(key, {
//         ...existing,
//         ...report,
//         count: Math.max(existing.count ?? 0, report.count ?? 0),
//         solutionsCount: Math.max(
//           existing.solutionsCount ?? 0,
//           report.solutionsCount ?? 0,
//         ),
//       });
//     });
//
//     if (
//       reports.length < PAGE_SIZE ||
//       (typeof response.totalPages === "number" && page >= response.totalPages)
//     ) {
//       break;
//     }
//
//     page += 1;
//   }
//
//   return Array.from(reportMap.values());
// };

const loadDefaultStats = async (): Promise<RightSidebarStatItem[]> => {
  const [data, publicReports] = await Promise.all([
    getRightSidebarStats().catch(
      () => null,
    ) as Promise<RightSidebarDefaultStatsResponse | null>,
    loadAllPublicFeedReports().catch(() => []),
  ]);

  const growingReports = publicReports.filter(
    (report) => getPublicReportReactionScore(report) >= HOT_REACTION_THRESHOLD,
  );
  const reportsScope = growingReports.length ? growingReports : publicReports;
  const totalReports = reportsScope.reduce(
    (total, report) => total + getSafeNumber(report.reportsCount),
    0,
  );
  const totalSolutions = reportsScope.reduce(
    (total, report) => total + getSafeNumber(report.solutionsCount),
    0,
  );

  return [
    {
      value: growingReports.length || data?.totalTickets || 0,
      singular: "problème qui prend de l'ampleur",
      plural: "problèmes qui prennent de l'ampleur",
    },
    {
      value: totalReports || data?.totalReports || 0,
      singular: "utilisateur concerné",
      plural: "utilisateurs concernés",
    },
    {
      value: totalSolutions,
      singular: "solution jugée utile",
      plural: "solutions jugées utiles",
    },
  ];

  // Anciennes données gardées en commentaire :
  // return [
  //   {
  //     value: data.totalReports,
  //     singular: "signalement",
  //     plural: "signalements",
  //     suffix: "dans les dernières 48h",
  //   },
  //   {
  //     value: data.totalTickets,
  //     singular: "problème",
  //     plural: "problèmes",
  //     suffix: "très signalés en ce moment",
  //   },
  // ];
};

const loadReportChronoStats = async (): Promise<RightSidebarStatItem[]> => {
  // Anciennes stats chrono gardées en commentaire :
  // return loadDefaultStats();

  const recentReports = (await loadAllPublicFeedReports()).filter(
    isPublicReportCreatedInLast24Hours,
  );

  return [
    {
      value: recentReports.length,
      singular: "nouveau problème",
      plural: "nouveaux problèmes",
      suffix: "ces dernières 24h",
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

  const blockingReportsCount = reports.reduce(
    (total, report) => total + getSafeNumber(report.count),
    0,
  );
  const unansweredBlockingReportsCount = reports
    .filter((report) => !report.hasBrandResponse)
    .reduce((total, report) => total + getSafeNumber(report.count), 0);

  return [
    {
      value: blockingReportsCount,
      singular: "signalement au total",
      plural: "signalements au total",
    },
    {
      value: unansweredBlockingReportsCount,
      singular: "signalement sans réponse",
      plural: "signalements sans réponse",
    },
  ];

  // Anciennes stats rage gardées en commentaire :
  // const reactingUserIds = new Set<string>();
  // const reportIds = reports.map((report) => String(report.reportingId));
  //
  // for (
  //   let index = 0;
  //   index < reportIds.length;
  //   index += REPORT_REACTION_BATCH_SIZE
  // ) {
  //   const reactionBatch = await Promise.all(
  //     reportIds
  //       .slice(index, index + REPORT_REACTION_BATCH_SIZE)
  //       .map((reportId) => fetchReportReactions(reportId).catch(() => [])),
  //   );
  //
  //   reactionBatch.flat().forEach((reaction) => {
  //     if (reaction.userId) {
  //       reactingUserIds.add(reaction.userId);
  //     }
  //   });
  // }
  //
  // return [
  //   {
  //     value: reactingUserIds.size,
  //     singular: "utilisateur",
  //     plural: "utilisateurs",
  //     suffix: "ont réagi aux publications de cette sélection",
  //   },
  //   {
  //     value: reports.length,
  //     singular: "problème",
  //     plural: "problèmes",
  //     suffix: "sont remontés dans le filtre rage",
  //   },
  // ];
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
      suffix: "",
    },
    {
      value: totals.totalComments,
      singular: "commentaire",
      plural: "commentaires",
      suffix: "",
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

const loadCdcChronoStats = async (): Promise<RightSidebarStatItem[]> => {
  const publicCoupsDeCoeur = await loadPaginatedItems({
    fetchPage: (page, limit) =>
      getPublicCoupsDeCoeur(page, limit) as Promise<PaginatedCdcResponse>,
    getItems: (response) => response.coupdeCoeurs ?? [],
    getTotalPages: (response) => response.totalPages ?? 1,
    getKey: (item) => item.id,
  });

  const recentThreshold = Date.now() - LAST_48_HOURS_IN_MS;
  const recentItems = publicCoupsDeCoeur.filter((item) => {
    const createdAt = new Date(item.createdAt).getTime();
    return !Number.isNaN(createdAt) && createdAt >= recentThreshold;
  });

  const totalReactions = recentItems.reduce(
    (sum, item) => sum + getReactionTotal(item.reactions),
    0,
  );

  return [
    {
      value: recentItems.length,
      singular: "coup de cœur récent",
      plural: "coups de cœur récents",
      suffix: "publiés sur les 48 dernières heures",
    },
    {
      value: totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "sur les coups de cœur les plus récents",
    },
  ];
};

const loadCdcEnflammesStats = async (): Promise<RightSidebarStatItem[]> => {
  const enflammesCoupsDeCoeur = await loadPaginatedItems({
    fetchPage: getEnflammesCoupsDeCoeur,
    getItems: (response) => response.coupdeCoeurs ?? [],
    getTotalPages: (response) => response.totalPages ?? 1,
    getKey: (item) => item.id,
  });

  const totalReactions = enflammesCoupsDeCoeur.reduce(
    (sum, item) => sum + getReactionTotal(item.reactions),
    0,
  );

  return [
    {
      value: enflammesCoupsDeCoeur.length,
      singular: "coup de cœur enflammé",
      plural: "coups de cœur enflammés",
      suffix: "dans cette sélection",
    },
    {
      value: totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "au total sur les coups de cœur enflammés",
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

const loadSuggestionRecentStats = async (): Promise<RightSidebarStatItem[]> => {
  const suggestions = await loadAllPublicFeedSuggestions();
  const openSuggestions = suggestions.filter((item) => !item.isAdopted);

  const totals = openSuggestions.reduce(
    (acc, item) => ({
      totalVotes: acc.totalVotes + (item.votes ?? 0),
      totalReactions: acc.totalReactions + getReactionTotal(item.reactions),
    }),
    { totalVotes: 0, totalReactions: 0 },
  );

  return [
    {
      value: openSuggestions.length,
      singular: "suggestion ouverte",
      plural: "suggestions ouvertes",
      suffix: "aux votes en ce moment",
    },
    {
      value: totals.totalVotes,
      singular: "vote",
      plural: "votes",
      suffix: "au total sur les suggestions ouvertes",
    },
    {
      value: totals.totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "au total sur les suggestions ouvertes",
    },
  ];
};

const loadSuggestionLikedStats = async (): Promise<RightSidebarStatItem[]> => {
  const suggestions = await loadAllPublicFeedSuggestions();
  const adoptedSuggestions = suggestions.filter((item) =>
    Boolean(item.isAdopted),
  );

  const totals = adoptedSuggestions.reduce(
    (acc, item) => ({
      totalVotes: acc.totalVotes + (item.votes ?? 0),
      totalReactions: acc.totalReactions + getReactionTotal(item.reactions),
    }),
    { totalVotes: 0, totalReactions: 0 },
  );

  return [
    {
      value: adoptedSuggestions.length,
      singular: "suggestion adoptée",
      plural: "suggestions adoptées",
    },
    {
      value: totals.totalVotes,
      singular: "vote",
      plural: "votes",
      suffix: "sur les suggestions adoptées",
    },
    {
      value: totals.totalReactions,
      singular: "réaction",
      plural: "réactions",
      suffix: "sur les suggestions adoptées",
    },
  ];
};

const RIGHT_SIDEBAR_STATS_LOADERS: Record<
  Exclude<RightSidebarStatsMode, "none">,
  () => Promise<RightSidebarStatItem[]>
> = {
  default: loadDefaultStats,
  "report-chrono": loadReportChronoStats,
  "report-rage": loadReportRageStats,
  "report-popular": loadReportPopularStats,
  "cdc-popular": loadCdcPopularStats,
  "cdc-chrono": loadCdcChronoStats,
  "cdc-enflammes": loadCdcEnflammesStats,
  "suggestion-popular": loadSuggestionPopularStats,
  "suggestion-recent": loadSuggestionRecentStats,
  "suggestion-liked": loadSuggestionLikedStats,
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
