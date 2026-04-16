import { useMemo } from "react";
import type { CSSProperties } from "react";
import type {
  CdcFeedFilterValue,
  PublicFeedFilterState,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "@src/components/feed/types/feedFilterTypes";
import FilterIllustrationNextToText from "@src/pages/home/home-illustration/FilterIllustrationNextToText";
import type { FilterIllustrationTabKey } from "@src/pages/home/home-illustration/filterIllustrationContent";
import RightSidebar from "@src/pages/public/components/sidebars/RightSidebar";
import type { FeedbackType } from "@src/types/Reports";
import type { BrandReportStats } from "../home-grouped-reports-list/utils/brandReportStats";

interface Props {
  activeTab: FeedbackType;
  activeFilter: string;
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  brandBannerStyle?: CSSProperties;
  brandReportStats?: BrandReportStats | null;
}

const DEFAULT_PUBLIC_FEED_FILTERS: PublicFeedFilterState = {
  selectedFilter: "report",
  reportFeedFilter: "chrono",
  cdcFeedFilter: "chrono",
  suggestionFeedFilter: "allSuggest",
};

const TAB_TO_ONGLET: Record<FeedbackType, FilterIllustrationTabKey> = {
  report: "report",
  coupdecoeur: "coupdecoeur",
  suggestion: "suggestion",
};

const isFeedbackBrandFocused = ({
  activeTab,
  activeFilter,
  selectedBrand,
  selectedCategory,
}: Pick<
  Props,
  "activeTab" | "activeFilter" | "selectedBrand" | "selectedCategory"
>) => {
  if (selectedBrand || selectedCategory) {
    return true;
  }

  if (activeTab === "report") {
    return activeFilter === "";
  }

  return activeFilter === "brandSolo";
};

const mapReportFilter = (activeFilter: string): ReportFeedFilterValue => {
  if (activeFilter === "confirmed") return "hot";
  if (activeFilter === "rage") return "rage";
  if (activeFilter === "popular") return "popular";
  if (activeFilter === "urgent") return "urgent";
  return "chrono";
};

const mapCdcFilter = (activeFilter: string): CdcFeedFilterValue => {
  if (activeFilter === "popular") return "popular";
  if (activeFilter === "enflammes") return "enflammes";
  return "chrono";
};

const mapSuggestionFilter = (
  activeFilter: string,
): SuggestionFeedFilterValue => {
  if (activeFilter === "recentSuggestion") return "recentSuggestion";
  if (activeFilter === "likedSuggestion") return "likedSuggestion";
  return "allSuggest";
};

const buildSidebarFilters = (
  activeTab: FeedbackType,
  activeFilter: string,
): PublicFeedFilterState => {
  if (activeTab === "report") {
    return {
      ...DEFAULT_PUBLIC_FEED_FILTERS,
      selectedFilter: "report",
      reportFeedFilter: mapReportFilter(activeFilter),
    };
  }

  if (activeTab === "coupdecoeur") {
    return {
      ...DEFAULT_PUBLIC_FEED_FILTERS,
      selectedFilter: "coupdecoeur",
      cdcFeedFilter: mapCdcFilter(activeFilter),
    };
  }

  return {
    ...DEFAULT_PUBLIC_FEED_FILTERS,
    selectedFilter: "suggestion",
    suggestionFeedFilter: mapSuggestionFilter(activeFilter),
  };
};

const FeedbackRightSidebar = ({
  activeTab,
  activeFilter,
  selectedBrand,
  selectedCategory,
  selectedSiteUrl,
  brandBannerStyle,
  brandReportStats,
}: Props) => {
  const onglet = TAB_TO_ONGLET[activeTab];
  const isBrandFocused = isFeedbackBrandFocused({
    activeTab,
    activeFilter,
    selectedBrand,
    selectedCategory,
  });

  const filters = useMemo(
    () => buildSidebarFilters(activeTab, activeFilter),
    [activeTab, activeFilter],
  );

  if (isBrandFocused) {
    return (
      <FilterIllustrationNextToText
        filter={activeFilter}
        selectedBrand={selectedBrand}
        siteUrl={selectedSiteUrl}
        selectedCategory={selectedCategory}
        onglet={onglet}
        withText
        containerStyle={selectedBrand ? brandBannerStyle : undefined}
        brandReportStats={brandReportStats}
      />
    );
  }

  return <RightSidebar filters={filters} />;
};

export default FeedbackRightSidebar;
