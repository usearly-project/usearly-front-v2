import React from "react";
import { useMixedFeed } from "./hooks/useMixedFeed";
import FeedItemRenderer from "./FeedItemRenderer";
import ExpandableSearchBar from "@src/components/shared/search/ExpandableSearchBar";
import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";
import "./MixedFeed.scss";
import AuthTooltip from "@src/components/shared/AuthTooltip";
import {
  FILTER_LABELS,
  FILTER_OPTIONS,
  REPORT_FILTER_OPTIONS,
  CDC_FILTER_OPTIONS,
  SUGGESTION_FILTER_OPTIONS,
} from "./constants/MixedFeed.constants";
import type { PublicFeedFilterState } from "./types/feedFilterTypes";
import { getItemId } from "./utils/MixedFeed.utils";

interface Props {
  isPublic?: boolean;
  onPublicFiltersChange?: (filters: PublicFeedFilterState) => void;
  isMobile?: boolean;
  showMobileHeaderText?: boolean;
}

const brandInitials = (label: string) => {
  const parts = label.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
  return (initials || label.slice(0, 2)).toUpperCase();
};

const MOBILE_BRAND_FILTER_ICON = "/assets/icons/tri-croissant.png";

const MixedFeed: React.FC<Props> = ({
  isPublic = false,
  onPublicFiltersChange,
  isMobile = false,
  showMobileHeaderText: showMobileHeaderTextProp,
}) => {
  const {
    filteredFeed,
    loading,
    hasMore,
    loadMore,
    searchValue,
    setSearchValue,
    selectedBrand,
    setSelectedBrand,
    availableBrands,
    selectedFilter,
    handleFilter,
    reportFeedFilter,
    setReportFeedFilter,
    cdcFeedFilter,
    setCdcFeedFilter,
    suggestionFeedFilter,
    setSuggestionFeedFilter,
    showAuthTooltip,
    tooltipText,
    tooltipPosition,
    activeSecondaryFilterLabel,
  } = useMixedFeed(isPublic, onPublicFiltersChange, isMobile);

  const showMobileHeaderText = showMobileHeaderTextProp ?? isMobile;

  // --- LOGIQUE DE FILTRAGE MOBILE ---
  // Sur petit mobile, on ne garde que "L'actu du moment" (valeur "all")
  // Ancien rendu mobile : ce libellé passait par un Champs bloqué sur "all".
  const displayedOptions = showMobileHeaderText
    ? FILTER_OPTIONS.filter((opt) => opt.value === "all")
    : FILTER_OPTIONS;

  const showSecondaryFilter = isPublic && selectedFilter !== "all";
  const brandOptions = React.useMemo<SelectFilterOption[]>(() => {
    return [
      // Ancien libellé : "Toutes les marques"
      { value: "", label: "Marque", iconFallback: "?" },
      ...availableBrands.map((entry) => ({
        value: entry.brand,
        label: entry.brand,
        iconAlt: entry.brand,
        iconFallback: brandInitials(entry.brand),
        siteUrl: entry.siteUrl,
      })),
    ];
  }, [availableBrands]);

  const emptyStateLabel =
    selectedBrand ||
    activeSecondaryFilterLabel ||
    (selectedFilter === "all" ? "l'actualité" : selectedFilter);

  return (
    <div className={`mixed-feed ${isMobile ? "is-mobile" : ""}`}>
      <div className="feed-header">
        <div className="feed-header__top">
          <div className="primary-filters">
            {showMobileHeaderText ? (
              <>
                <h2 className="feed-header__mobile-title">
                  {FILTER_LABELS.all}
                </h2>
              </>
            ) : (
              <Champs
                options={displayedOptions}
                value={selectedFilter}
                onChange={handleFilter}
                align="left"
                fitWidthToOptions
              />
            )}
          </div>

          {isMobile && (
            <div className="feed-header__brand-filter">
              <Champs
                options={brandOptions}
                value={selectedBrand}
                onChange={setSelectedBrand}
                className="brand-select-inline"
                disabled={!availableBrands.length}
                brandSelect
                minWidth={230}
                align="left"
                fixedBrandIconUrl={MOBILE_BRAND_FILTER_ICON}
              />
            </div>
          )}

          {/* On n'affiche pas les filtres secondaires ni la recherche sur mobile selon ton souhait */}
          {!isMobile && (
            <>
              {showSecondaryFilter ? (
                <div className="feed-header__secondary">
                  {selectedFilter === "report" && (
                    <Champs
                      options={REPORT_FILTER_OPTIONS}
                      value={reportFeedFilter}
                      onChange={(v) => setReportFeedFilter(v as any)}
                      align="left"
                    />
                  )}
                  {selectedFilter === "coupdecoeur" && (
                    <Champs
                      options={CDC_FILTER_OPTIONS}
                      value={cdcFeedFilter}
                      onChange={(v) => setCdcFeedFilter(v as any)}
                      align="left"
                    />
                  )}
                  {selectedFilter === "suggestion" && (
                    <Champs
                      options={SUGGESTION_FILTER_OPTIONS}
                      value={suggestionFeedFilter}
                      onChange={(v) => setSuggestionFeedFilter(v as any)}
                      align="left"
                    />
                  )}
                </div>
              ) : (
                <ExpandableSearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  onClear={() => setSearchValue("")}
                  placeholder="Rechercher..."
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Liste des items */}
      <div className="feed-content">
        {!loading && filteredFeed.length === 0 && (
          <div className="feed-empty-state">
            Aucun résultat pour {emptyStateLabel}
          </div>
        )}

        {filteredFeed.map((item) => (
          <FeedItemRenderer
            key={`${item.type}-${getItemId(item)}`}
            item={item}
            isOpen={true}
            isPublic={isPublic}
            isMobile={isMobile}
          />
        ))}

        {loading && <p className="feed-loading">Chargement...</p>}

        {hasMore && (
          <button
            onClick={loadMore}
            className="load-more-btn"
            disabled={loading}
            aria-label="Voir plus"
          >
            {loading ? "Chargement..." : "Voir plus"}
          </button>
        )}

        {!hasMore && filteredFeed.length > 0 && (
          <p className="feed-end">Tu as tout vu 👍</p>
        )}
      </div>

      <AuthTooltip
        show={showAuthTooltip}
        text={tooltipText}
        position={tooltipPosition}
      />
    </div>
  );
};

export default MixedFeed;
