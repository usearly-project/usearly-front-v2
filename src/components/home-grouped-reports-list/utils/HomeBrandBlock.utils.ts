import { parseISO, isAfter } from "date-fns";
import type { PublicGroupedReport } from "@src/types/Reports";

export const getUniqueSubCategories = (reports: PublicGroupedReport[]) => {
  return reports
    .flatMap((report) =>
      report.subCategories.map((sub) => ({
        ...sub,
        __status: sub.status,
        __reportId: report.reportingId,
      })),
    )
    .reduce(
      (acc, sub) => {
        if (!acc[sub.subCategory]) {
          acc[sub.subCategory] = {
            subCategory: sub.subCategory,
            status: sub.__status,
            reportIds: [sub.__reportId],
            descriptions: [...sub.descriptions],
            count: sub.descriptions.length,
          };
        } else {
          const existingDescriptions = acc[sub.subCategory].descriptions;
          const newDescriptions = sub.descriptions.filter(
            (desc) => !existingDescriptions.some((d: any) => d.id === desc.id),
          );
          acc[sub.subCategory].descriptions = [
            ...existingDescriptions,
            ...newDescriptions,
          ];
          acc[sub.subCategory].count = acc[sub.subCategory].descriptions.length;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
};

export const getMostRecentDate = (reports: PublicGroupedReport[]) => {
  let latest: Date | null = null;
  for (const report of reports) {
    for (const sub of report.subCategories) {
      for (const desc of sub.descriptions) {
        const date = parseISO(desc.createdAt);
        if (!latest || isAfter(date, latest)) latest = date;
      }
    }
  }
  return latest;
};
