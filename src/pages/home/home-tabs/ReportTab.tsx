import React, { useEffect } from "react";
import HomeGroupedReportsList from "../home-grouped-reports-list/HomeGroupedReportsList";
// import SearchBar from "../components/searchBar/SearchBar";
import EndOfList from "./EndOfList";
// import FeedbackRightSidebar from "./FeedbackRightSidebar";
import type { FeedbackType } from "@src/types/Reports";
import type { BrandReportStats } from "../home-grouped-reports-list/utils/brandReportStats";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  onThemeChange: (tab: FeedbackType) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedMainCategory: string;
  setSelectedMainCategory: (c: string) => void;
  selectedSiteUrl?: string;
  setSelectedSiteUrl: (url?: string) => void;
  brandBannerStyle: React.CSSProperties;
  displayedCount: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  showRightPanel?: boolean;
}

const ReportTab: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  onThemeChange,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedMainCategory,
  setSelectedMainCategory,
  setSelectedSiteUrl,
  selectedSiteUrl,
  // brandBannerStyle,
  displayedCount,
  searchTerm,
  onSearchTermChange,
  // showRightPanel = true,
}) => {
  const [, setBrandReportStats] = React.useState<BrandReportStats | null>(null);
  // Ancien code desactive : appeler setBrandReportStats pendant le rendu
  // declenche l'erreur React "Too many re-renders".
  // if (!brandReportStats) {
  //   setBrandReportStats(null);
  // }
  useEffect(() => {
    if (!selectedBrand || selectedCategory) {
      setBrandReportStats(null);
    }
  }, [selectedBrand, selectedCategory]);

  const bannerClassName = [
    "report-banner-container",
    selectedBrand || selectedCategory
      ? "banner-filtered"
      : `banner-${activeFilter}`,
    selectedBrand ? "brandSelected" : "",
    selectedMainCategory || selectedCategory ? "brandCategorySelected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  // const rightPanelClassName = [
  //   "right-panel",
  //   selectedBrand || selectedCategory ? "right-panel--brand-colored" : "",
  // ]
  //   .filter(Boolean)
  //   .join(" ");

  return (
    <div className={bannerClassName}>
      <div className="feedback-list-wrapper">
        <HomeGroupedReportsList
          activeTab={"report" as FeedbackType}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onThemeChange={onThemeChange}
          viewMode={
            activeFilter === "confirmed"
              ? "confirmed"
              : activeFilter === "chrono"
                ? "chrono"
                : "flat"
          }
          onViewModeChange={() => {}}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedMainCategory={selectedMainCategory}
          setSelectedMainCategory={setSelectedMainCategory}
          setSelectedSiteUrl={setSelectedSiteUrl}
          selectedSiteUrl={selectedSiteUrl}
          totalityCount={displayedCount}
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          onBrandReportStatsChange={setBrandReportStats}
        />
        {displayedCount > 0 && <EndOfList />}
      </div>
    </div>
  );
};

export default ReportTab;
