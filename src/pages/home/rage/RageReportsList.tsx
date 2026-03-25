import React from "react";
import type {
  ConfirmedSubcategoryReport,
  ExplodedGroupedReport,
} from "@src/types/Reports";
import ReportListView from "../ReportListView";
/* import { useBrandResponsesMap } from "@src/hooks/useBrandResponsesMap";
import { normalizeBrandResponse } from "@src/utils/brandResponse"; */

const RageReportsList = ({
  data,
  loading,
  hasMore,
  loadMore,
  loaderRef,
  expandedItems,
  handleToggle,
  searchTerm,
  onClearSearchTerm,
}: {
  data: ConfirmedSubcategoryReport[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  searchTerm?: string;
  onClearSearchTerm?: () => void;
}) => {
  // On transforme les résultats du backend en ExplodedGroupedReport
  const explodedData: ExplodedGroupedReport[] = data.map((r) => ({
    id: String(r.reportingId),
    reportingId: String(r.reportingId),
    category: r.category,
    marque: r.marque,
    siteUrl: r.siteUrl ?? undefined,
    totalCount: r.count,
    reactions: [],

    solutionsCount: r.solutionsCount ?? 0,

    // ✅ FIX ICI
    hasBrandResponse: r.hasBrandResponse ?? null,

    subCategory: {
      subCategory: r.subCategory,
      status: r.status,
      count: r.count,
      descriptions: (r.descriptions ?? []).map((d: any) => ({
        ...d,
        author: d.author ?? {
          id: d.userId ?? "",
          pseudo: d.pseudo ?? "Utilisateur",
          avatar: d.avatar ?? null,
        },
      })),
    },

    subCategories: [
      {
        subCategory: r.subCategory,
        status: r.status,
        count: r.count,
        descriptions: (r.descriptions ?? []).map((d: any) => ({
          ...d,
          author: d.author ?? {
            id: d.userId ?? "",
            pseudo: d.pseudo ?? "Utilisateur",
            avatar: d.avatar ?? null,
          },
        })),
      },
    ],
  }));
  console.log("RAGE RAW 👉", data[0].hasBrandResponse);
  return (
    <ReportListView
      filter="rage"
      viewMode="confirmed"
      flatData={explodedData}
      chronoData={{}}
      popularData={{}}
      popularEngagementData={{}}
      rageData={{}}
      expandedItems={expandedItems}
      handleToggle={handleToggle}
      loadingChrono={false}
      loadingPopular={false}
      loadingPopularEngagement={false}
      loadingRage={loading}
      hasMoreRage={hasMore}
      loadMoreRage={loadMore}
      loaderRef={loaderRef}
      searchTerm={searchTerm}
      onClearSearchTerm={onClearSearchTerm}
    />
  );
};

export default RageReportsList;
