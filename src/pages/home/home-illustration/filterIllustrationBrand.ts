import type { BrandReportStats } from "../home-grouped-reports-list/utils/brandReportStats";

export const EMPTY_BRAND_REPORT_STATS: BrandReportStats = {
  problemsCount: 0,
  impactedUsersCount: 0,
  solutionsCount: 0,
};

export const getBrandLogoKeys = (brandName: string, siteUrl?: string) => {
  const normalizedBrandName = brandName.toLowerCase().trim();
  const domain =
    siteUrl
      ?.replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase() || "";

  return [
    `${normalizedBrandName}|${domain}`,
    `${normalizedBrandName}|${normalizedBrandName}.com`,
    normalizedBrandName,
  ];
};

export const buildFilteredSidebarClassName = ({
  hasBrandSoloIllustration,
  shouldShowCategoryOnly,
  shouldShowSelectedBrandTitle,
}: {
  hasBrandSoloIllustration: boolean;
  shouldShowCategoryOnly: boolean;
  shouldShowSelectedBrandTitle: boolean;
}) =>
  [
    "filter-illustration-sidebar",
    "filtered",
    !shouldShowCategoryOnly && hasBrandSoloIllustration ? "brand-solo" : "",
    shouldShowSelectedBrandTitle
      ? "filter-illustration-sidebar--brand-report"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
