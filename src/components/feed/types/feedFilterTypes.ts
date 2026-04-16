export type FeedFilterValue = "all" | "report" | "coupdecoeur" | "suggestion";

export type ReportFeedFilterValue =
  | "hot"
  | "rage"
  | "popular"
  | "chrono"
  | "urgent";

export type CdcFeedFilterValue = "popular" | "enflammes" | "chrono";

export type SuggestionFeedFilterValue =
  | "allSuggest"
  | "recentSuggestion"
  | "likedSuggestion";

export type FeedBrandFilterOption = {
  brand: string;
  siteUrl?: string;
};

export interface PublicFeedFilterState {
  selectedFilter: FeedFilterValue;
  reportFeedFilter: ReportFeedFilterValue;
  cdcFeedFilter: CdcFeedFilterValue;
  suggestionFeedFilter: SuggestionFeedFilterValue;
  selectedBrand?: string;
}
