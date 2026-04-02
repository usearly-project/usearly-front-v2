import type { TicketStatusKey } from "@src/types/ticketStatus";

export type BrandFilteredReportItem = {
  reportingId: string;
  subCategory?: string | null;
  marque?: string | null;
  siteUrl?: string | null;
  capture?: string | null;
  descriptions?: any[];
  description?: any;
  status?: TicketStatusKey;
  count?: number | null;
  solutionsCount?: number | null;
};

export type BrandReportTicket = {
  subCategory: string;
  brand: string;
  siteUrl?: string | null;
  capture?: string | null;
  pivotReportId: string;
  reportIds: string[];
  descriptions: any[];
  status: TicketStatusKey;
  count: number;
  solutionsCount: number;
};

export type BrandReportStats = {
  problemsCount: number;
  impactedUsersCount: number;
  solutionsCount: number;
};

const getSafeCount = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : 1;

const getSafeSolutionsCount = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export function groupBrandReportsAsTickets(
  reports: BrandFilteredReportItem[],
): BrandReportTicket[] {
  const map: Record<string, BrandReportTicket> = {};

  for (const report of reports) {
    const subCategory = report.subCategory || "Autre";
    const reportCount = getSafeCount(report.count);
    const reportSolutionsCount = getSafeSolutionsCount(report.solutionsCount);

    if (!map[subCategory]) {
      map[subCategory] = {
        subCategory,
        brand: report.marque || "",
        siteUrl: report.siteUrl,
        capture: report.capture ?? null,
        pivotReportId: report.reportingId,
        reportIds: [report.reportingId],
        descriptions: Array.isArray(report.descriptions)
          ? [...report.descriptions]
          : report.description
            ? [report.description]
            : [],
        status: (report.status ?? "open") as TicketStatusKey,
        count: reportCount,
        solutionsCount: reportSolutionsCount,
      };

      continue;
    }

    if (report.reportingId < map[subCategory].pivotReportId) {
      map[subCategory].pivotReportId = report.reportingId;
    }

    map[subCategory].reportIds.push(report.reportingId);
    map[subCategory].count += reportCount;

    if (Array.isArray(report.descriptions)) {
      map[subCategory].descriptions.push(...report.descriptions);
    } else if (report.description) {
      map[subCategory].descriptions.push(report.description);
    }

    map[subCategory].solutionsCount += reportSolutionsCount;
  }

  return Object.values(map);
}

export const getBrandReportStats = (
  reports: BrandFilteredReportItem[],
): BrandReportStats => {
  const ticketGroups = groupBrandReportsAsTickets(reports);

  return {
    problemsCount: ticketGroups.length,
    impactedUsersCount: ticketGroups.reduce(
      (total, ticket) => total + getSafeCount(ticket.count),
      0,
    ),
    solutionsCount: ticketGroups.reduce(
      (total, ticket) => total + getSafeSolutionsCount(ticket.solutionsCount),
      0,
    ),
  };
};
