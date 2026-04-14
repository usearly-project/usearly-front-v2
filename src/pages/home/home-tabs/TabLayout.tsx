import React from "react";
import FeedbackRightSidebar from "./FeedbackRightSidebar";

interface TabLayoutProps {
  /** Classe container : cdc-banner-container | suggestion-banner-container */
  containerClassName: string;
  /** Style : brandBannerStyle ou suggestionBannerStyle */
  bannerStyle: React.CSSProperties;

  /** Filtre actif (pour FilterIllustration) */
  activeFilter: string;
  /** onglet: "coupdecoeur" | "suggestion" */
  onglet: "coupdecoeur" | "suggestion";

  /** Marque / URL / Catégorie */
  selectedBrand?: string;
  selectedSiteUrl?: string;
  selectedCategory?: string;

  /** Affiche dans la colonne centre les filtres */
  renderFilters: () => React.ReactNode;

  /** Affiche la liste (FeedbackView ou skeleton de la liste) */
  renderContent: () => React.ReactNode;

  /** isLoading complet OU isInitialLoading */
  isLoading: boolean;
  showRightPanel?: boolean;
}

const TabLayout: React.FC<TabLayoutProps> = ({
  containerClassName,
  bannerStyle,
  activeFilter,
  onglet,
  selectedBrand,
  selectedSiteUrl,
  selectedCategory,
  renderFilters,
  renderContent,
  showRightPanel = true,
}) => {
  const isBrandFocused = Boolean(selectedBrand || selectedCategory);
  const containerClasses = [
    containerClassName,
    selectedBrand ? "banner-filtered" : `banner-${activeFilter}`,
    selectedBrand ? "brandSelected" : "",
    selectedCategory ? "brandCategorySelected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const rightPanelClasses = [
    "right-panel",
    isBrandFocused ? "right-panel--brand-colored" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} style={bannerStyle}>
      {/* -----------------------------
          Colonne centrale
      --------------------------------*/}
      <div
        className={`feedback-list-wrapper ${selectedBrand ? "brand-selected" : ""}`}
      >
        {/* 🔥 Filtres TOUJOURS visibles (loading ou pas) */}
        {renderFilters()}

        <div
          className={`feedback-view-container ${selectedBrand ? "brand-selected" : ""}`}
        >
          {/* 🔥 Contenu (liste ou skeleton) */}
          {renderContent()}
        </div>
      </div>

      {/* -----------------------------
          Colonne droite — BANDEAU
      --------------------------------*/}
      {showRightPanel && (
        <aside
          className={rightPanelClasses}
          style={isBrandFocused ? bannerStyle : undefined}
        >
          <FeedbackRightSidebar
            activeTab={onglet}
            activeFilter={activeFilter}
            selectedBrand={selectedBrand}
            selectedCategory={selectedCategory}
            selectedSiteUrl={selectedSiteUrl}
          />
        </aside>
      )}
    </div>
  );
};

export default TabLayout;
