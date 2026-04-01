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
}

const MixedFeed: React.FC<Props> = ({
  isPublic = false,
  onPublicFiltersChange,
}) => {
  // Logic extracted to useMixedFeed hook for better maintainability
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

  const showSecondaryFilter = isPublic && selectedFilter !== "all";

  return (
    <div className="mixed-feed">
      <div className="feed-header">
        <div className="feed-header__top">
          <div className="primary-filters">
            <Champs
              options={FILTER_OPTIONS}
              value={selectedFilter}
              onChange={handleFilter}
              align="left"
            />
          </div>

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
          />
        ))}

        {loading && <p className="feed-loading">Chargement...</p>}
        {!loading && hasMore && (
          <button onClick={loadMore} className="load-more-btn">
            Voir plus
          </button>
        )}
      </div>

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default MixedFeed;
