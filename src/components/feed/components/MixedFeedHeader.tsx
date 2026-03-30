import ExpandableSearchBar from "@src/components/shared/search/ExpandableSearchBar";
import Champs from "@src/components/champs/Champs";
import type {
  CdcFeedFilterValue,
  FeedFilterValue,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "../feedFilterTypes";
import {
  CDC_FILTER_OPTIONS,
  FILTER_OPTIONS,
  REPORT_FILTER_OPTIONS,
  SUGGESTION_FILTER_OPTIONS,
} from "../mixedFeedOptions";

type Props = {
  selectedFilter: FeedFilterValue;
  searchValue: string;
  showSecondaryFilter: boolean;
  reportFeedFilter: ReportFeedFilterValue;
  cdcFeedFilter: CdcFeedFilterValue;
  suggestionFeedFilter: SuggestionFeedFilterValue;
  onPrimaryFilterChange: (value: FeedFilterValue) => void;
  onReportFilterChange: (value: ReportFeedFilterValue) => void;
  onCdcFilterChange: (value: CdcFeedFilterValue) => void;
  onSuggestionFilterChange: (value: SuggestionFeedFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
};

function MixedFeedHeader({
  selectedFilter,
  searchValue,
  showSecondaryFilter,
  reportFeedFilter,
  cdcFeedFilter,
  suggestionFeedFilter,
  onPrimaryFilterChange,
  onReportFilterChange,
  onCdcFilterChange,
  onSuggestionFilterChange,
  onSearchChange,
  onSearchClear,
}: Props) {
  return (
    <div className="feed-header">
      <div className="feed-header__top">
        <div className="primary-filters">
          <Champs
            options={FILTER_OPTIONS}
            value={selectedFilter}
            onChange={onPrimaryFilterChange}
            activeClassName="hot-active"
            minWidth={275}
            minWidthPart="2"
            align="left"
          />
        </div>

        {showSecondaryFilter ? (
          <div className="feed-header__secondary">
            {selectedFilter === "report" && (
              <Champs
                options={REPORT_FILTER_OPTIONS}
                value={reportFeedFilter}
                onChange={onReportFilterChange}
                activeClassName="hot-active"
                minWidth={320}
                minWidthPart="2"
                align="left"
              />
            )}

            {selectedFilter === "coupdecoeur" && (
              <Champs
                options={CDC_FILTER_OPTIONS}
                value={cdcFeedFilter}
                onChange={onCdcFilterChange}
                activeClassName="hot-active"
                minWidth={320}
                minWidthPart="2"
                align="left"
              />
            )}

            {selectedFilter === "suggestion" && (
              <Champs
                options={SUGGESTION_FILTER_OPTIONS}
                value={suggestionFeedFilter}
                onChange={onSuggestionFilterChange}
                activeClassName="hot-active"
                minWidth={320}
                minWidthPart="2"
                align="left"
              />
            )}
          </div>
        ) : (
          <ExpandableSearchBar
            value={searchValue}
            onChange={onSearchChange}
            onClear={onSearchClear}
            className="feed-header__search"
            placeholder="Rechercher une publication"
            ariaLabel="Rechercher dans les publications affichées"
          />
        )}
      </div>
    </div>
  );
}

export default MixedFeedHeader;
