import { useState, useEffect, useCallback } from "react";
import { getGroupedReportsByDate } from "@src/services/feedbackService";
import type {
  ExplodedGroupedReport,
  GetGroupedReportsByDateResponse,
  PublicGroupedReportFromAPI,
} from "@src/types/Reports";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

type NormalizedPublicGroupedReportFromAPI = Omit<
  PublicGroupedReportFromAPI,
  "date"
> & {
  date?: string;
};

const normalizeDateKey = (value?: string | null) => {
  if (typeof value !== "string") return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const isoDatePart = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoDatePart?.[1]) {
    return isoDatePart[1];
  }

  const parsedDate = new Date(trimmedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString().slice(0, 10);
};

const flattenReportsByDate = (
  rawData:
    | GetGroupedReportsByDateResponse["data"]
    | PublicGroupedReportFromAPI[],
): NormalizedPublicGroupedReportFromAPI[] => {
  if (Array.isArray(rawData)) {
    return rawData.map((report) => ({
      ...report,
      date: normalizeDateKey(
        report.date ?? report.descriptions?.[0]?.createdAt,
      ),
    }));
  }

  return Object.entries(rawData).flatMap(([dateKey, reports]) =>
    reports.map((report) => ({
      ...report,
      date: normalizeDateKey(
        report.date ?? dateKey ?? report.descriptions?.[0]?.createdAt,
      ),
    })),
  );
};

export const usePaginatedGroupedReportsByDate = (
  enabled: boolean,
  pageSize = 10,
) => {
  const [data, setData] = useState<ExplodedGroupedReport[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, enabled]);

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response: GetGroupedReportsByDateResponse =
          await getGroupedReportsByDate(page, pageSize);

        if (!response?.data || typeof response.data !== "object") {
          console.warn(
            "⚠️ Format inattendu pour getGroupedReportsByDate:",
            response,
          );
          setHasMore(false);
          return;
        }

        const normalizedReports = flattenReportsByDate(response.data);

        const newData: ExplodedGroupedReport[] = normalizedReports.map(
          (report) => ({
            id: report.reportingId,
            reportingId: report.reportingId,
            marque: report.marque,
            category: report.category,
            siteUrl: report.siteUrl,
            capture: report.capture || null,
            totalCount: report.count,
            status: report.status,
            solutionsCount: report.solutionsCount ?? 0,
            hasBrandResponse: normalizeBrandResponse(report.hasBrandResponse, {
              brand: report.marque,
              siteUrl: report.siteUrl ?? null,
            }),
            subCategory: {
              subCategory: report.subCategory,
              status: report.status,
              count: report.count,
              descriptions: report.descriptions || [], // ✅ ici !
            },
            subCategories: [
              {
                subCategory: report.subCategory,
                status: report.status,
                count: report.count,
                descriptions: report.descriptions || [], // ✅ ici aussi !
              },
            ],
            reactions: [],
            date: report.date,
          }),
        );

        // ✅ concaténation propre sans écraser les précédents
        //setData((prev) => [...prev, ...newData]);
        setData((prev) => {
          const merged = page === 1 ? newData : [...prev, ...newData];
          const unique = new Map(
            merged.map((r) => [
              `${r.reportingId}-${r.subCategory.subCategory}`,
              r,
            ]),
          );
          return Array.from(unique.values());
        });

        setHasMore(page < response.totalPages);
      } catch (error) {
        console.error("❌ Erreur chargement reports par date:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, enabled, pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { data, loading, hasMore, loadMore, reset };
};
