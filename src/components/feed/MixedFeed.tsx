import React from "react";
import { useMixedFeed } from "./hooks/useMixedFeed";
import FeedItemRenderer from "./FeedItemRenderer";
import ExpandableSearchBar from "@src/components/shared/search/ExpandableSearchBar";
import Champs from "@src/components/champs/Champs";
import "./MixedFeed.scss";
import {
  FILTER_OPTIONS,
  REPORT_FILTER_OPTIONS,
  CDC_FILTER_OPTIONS,
  SUGGESTION_FILTER_OPTIONS,
} from "./constants/MixedFeed.constants";
import { getItemId } from "./utils/MixedFeed.utils";

interface Props {
  isPublic?: boolean;
  onPublicFiltersChange?: (filters: any) => void;
  isMobile?: boolean;
}

const MixedFeed: React.FC<Props> = ({
  isPublic = false,
  onPublicFiltersChange,
  isMobile = false,
}) => {
  const {
    filteredFeed,
    loading,
    hasMore,
    loadMore,
    searchValue,
    setSearchValue,
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
    activeSecondaryFilterLabel,
  } = useMixedFeed(isPublic, onPublicFiltersChange);

  // --- LOGIQUE DE FILTRAGE MOBILE ---
  // Sur mobile, on ne garde que "L'actu du moment" (valeur "all")
  const displayedOptions = isMobile
    ? FILTER_OPTIONS.filter((opt) => opt.value === "all")
    : FILTER_OPTIONS;

  const showSecondaryFilter = isPublic && selectedFilter !== "all";

  return (
    <div className={`mixed-feed ${isMobile ? "is-mobile" : ""}`}>
      <div className="feed-header">
        <div className="feed-header__top">
          <div className="primary-filters">
            <Champs
              options={displayedOptions}
              value={isMobile ? "all" : selectedFilter}
              onChange={isMobile ? () => {} : handleFilter} // Bloque le changement sur mobile
              align="left"
            />
          </div>

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
            Aucun résultat pour {activeSecondaryFilterLabel || selectedFilter}
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
        {!loading && hasMore && (
          <button
            onClick={loadMore}
            className="load-more-btn"
            aria-label="Voir plus"
          >
            Voir plus
          </button>
        )}
      </div>

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default MixedFeed;
