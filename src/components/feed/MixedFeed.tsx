import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  CdcFeedFilterValue,
  FeedFilterValue,
  PublicFeedFilterState,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "./feedFilterTypes";
import FeedItemRenderer from "./FeedItemRenderer";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import "./MixedFeed.scss";
import { useAuth } from "@src/services/AuthContext";
import MixedFeedHeader from "./components/MixedFeedHeader";
import { useAuthTooltip } from "./hooks/useAuthTooltip";
import { getFeedItemKey, useMixedFeedData } from "./hooks/useMixedFeedData";
import { FILTER_LABELS } from "./mixedFeedOptions";

interface Props {
  isPublic?: boolean;
  onPublicFiltersChange?: (filters: PublicFeedFilterState) => void;
}

const AUTH_TOOLTIP_BY_FILTER: Record<
  Exclude<FeedFilterValue, "all">,
  string
> = {
  report: "Connecte-toi pour voir les signalements",
  coupdecoeur: "Connecte-toi pour voir les coups de cœur",
  suggestion: "Connecte-toi pour voir les suggestions",
};

const MixedFeed: React.FC<Props> = ({
  isPublic = false,
  onPublicFiltersChange,
}) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [searchValue, setSearchValue] = useState("");
  const selectedFilter: FeedFilterValue = "all";
  const [reportFeedFilter, setReportFeedFilter] =
    useState<ReportFeedFilterValue>("chrono");
  const [cdcFeedFilter, setCdcFeedFilter] =
    useState<CdcFeedFilterValue>("chrono");
  const [suggestionFeedFilter, setSuggestionFeedFilter] =
    useState<SuggestionFeedFilterValue>("allSuggest");
  const navigate = useNavigate();
  const {
    tooltipText,
    isTooltipVisible: showAuthTooltip,
    showTooltip,
  } = useAuthTooltip();
  const {
    filteredFeed,
    hasSearchQuery,
    hasTypeFilter,
    activeSecondaryFilterLabel,
  } = useMixedFeedData({
    feed,
    searchValue,
    selectedFilter,
    reportFeedFilter,
    cdcFeedFilter,
    suggestionFeedFilter,
  });
  const showSecondaryFilter = isPublic && selectedFilter !== "all";

  useEffect(() => {
    if (showSecondaryFilter) {
      setSearchValue("");
    }
  }, [showSecondaryFilter]);

  useEffect(() => {
    if (!isPublic || !onPublicFiltersChange) return;

    onPublicFiltersChange({
      selectedFilter,
      reportFeedFilter,
      cdcFeedFilter,
      suggestionFeedFilter,
    });
  }, [
    cdcFeedFilter,
    isPublic,
    onPublicFiltersChange,
    reportFeedFilter,
    selectedFilter,
    suggestionFeedFilter,
  ]);

  const redirectToFeedbackTab = (type: FeedFilterValue) => {
    const targetTab = type === "all" ? "report" : type;
    navigate(`/feedback?tab=${targetTab}`);
  };

  const handleFilter = (type: FeedFilterValue) => {
    if (isPublic) {
      redirectToFeedbackTab(type);
      return;
    }

    if (type === "all") return;

    if (!isAuthenticated) {
      showTooltip(AUTH_TOOLTIP_BY_FILTER[type]);
      return;
    }

    navigate(`/feedback?tab=${type}`);
  };

  const handleReportFilterChange = (value: ReportFeedFilterValue) => {
    if (isPublic) {
      redirectToFeedbackTab(selectedFilter);
      return;
    }

    setReportFeedFilter(value);
  };

  const handleCdcFilterChange = (value: CdcFeedFilterValue) => {
    if (isPublic) {
      redirectToFeedbackTab(selectedFilter);
      return;
    }

    setCdcFeedFilter(value);
  };

  const handleSuggestionFilterChange = (value: SuggestionFeedFilterValue) => {
    if (isPublic) {
      redirectToFeedbackTab(selectedFilter);
      return;
    }

    setSuggestionFeedFilter(value);
  };

  return (
    <div className="mixed-feed">
      <MixedFeedHeader
        selectedFilter={selectedFilter}
        searchValue={searchValue}
        showSecondaryFilter={showSecondaryFilter}
        reportFeedFilter={reportFeedFilter}
        cdcFeedFilter={cdcFeedFilter}
        suggestionFeedFilter={suggestionFeedFilter}
        onPrimaryFilterChange={handleFilter}
        onReportFilterChange={handleReportFilterChange}
        onCdcFilterChange={handleCdcFilterChange}
        onSuggestionFilterChange={handleSuggestionFilterChange}
        onSearchChange={setSearchValue}
        onSearchClear={() => setSearchValue("")}
      />

      {!loading &&
        feed.length > 0 &&
        filteredFeed.length === 0 &&
        (hasSearchQuery || hasTypeFilter) && (
          <div className="feed-empty-state">
            {hasSearchQuery
              ? `Aucune publication ne correspond à "${searchValue.trim()}".`
              : activeSecondaryFilterLabel
                ? `Aucune publication disponible pour "${activeSecondaryFilterLabel}".`
                : `Aucune publication disponible dans ${FILTER_LABELS[
                    selectedFilter
                  ].toLowerCase()}.`}
          </div>
        )}

      {filteredFeed.map((item) => (
        <FeedItemRenderer
          key={getFeedItemKey(item)}
          item={item}
          isOpen={true}
          isPublic={isPublic}
        />
      ))}

      {loading && <p className="feed-loading">Chargement...</p>}

      {!loading && hasMore && (
        <button onClick={loadMore} className="load-more-btn">
          Load more
        </button>
      )}

      {!loading && !hasMore && feed.length > 0 && (
        <p className="end-feed">Tu as tout vu 👀</p>
      )}

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default MixedFeed;
