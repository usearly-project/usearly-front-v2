import React from "react"; // On retire useState d'ici
import HomeGroupedReportsList from "../home-grouped-reports-list/HomeGroupedReportsList";
import EndOfList from "./EndOfList";
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
  // --- INDISPENSABLE : On ajoute la prop pour remonter les stats au parent ---
  onBrandReportStatsChange?: (stats: BrandReportStats | null) => void;
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
  displayedCount,
  searchTerm,
  onSearchTermChange,
  onBrandReportStatsChange, // Récupéré depuis les props
}) => {
  // On supprime le useState local car c'est Home.tsx qui gère l'état maintenant

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
          // ON TRANSMET LES STATS AU PARENT (HOME)
          onBrandReportStatsChange={onBrandReportStatsChange}
        />
        {displayedCount > 0 && <EndOfList />}
      </div>
    </div>
  );
};

export default ReportTab;
