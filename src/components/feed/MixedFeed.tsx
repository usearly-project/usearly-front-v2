import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "@src/types/feedItem";
import type {
  CdcFeedFilterValue,
  FeedFilterValue,
  PublicFeedFilterState,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "./feedFilterTypes";
import FeedItemRenderer from "./FeedItemRenderer";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import ExpandableSearchBar from "@src/components/shared/search/ExpandableSearchBar";
import { filterFeedItems } from "@src/utils/feedSearch";
import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";
import "./MixedFeed.scss";
import { useAuth } from "@src/services/AuthContext";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import usearlyIcon from "/usearly-favicon.png";

interface Props {
  isPublic?: boolean;
  onPublicFiltersChange?: (filters: PublicFeedFilterState) => void;
}

type ReportFeedItem = Extract<FeedItem, { type: "report" }>;
type CdcFeedItem = Extract<FeedItem, { type: "cdc" }>;
type SuggestionFeedItem = Extract<FeedItem, { type: "suggestion" }>;

const FILTER_LABELS: Record<FeedFilterValue, string> = {
  all: "L'actu du moment",
  report: "Les signalements",
  coupdecoeur: "Les coups de cœur",
  suggestion: "Les suggestions",
};

const FILTER_OPTIONS: SelectFilterOption<FeedFilterValue>[] = [
  {
    value: "all",
    iconUrl: usearlyIcon,
    iconAlt: "All feedback",
    iconFallback: "A",
    label: FILTER_LABELS.all,
  },
  {
    value: "report",
    iconUrl: reportYellowIcon,
    iconAlt: "Signalements",
    iconFallback: "S",
    label: FILTER_LABELS.report,
  },
  {
    value: "coupdecoeur",
    iconUrl: likeRedIcon,
    iconAlt: "Coups de cœur",
    iconFallback: "C",
    label: FILTER_LABELS.coupdecoeur,
  },
  {
    value: "suggestion",
    iconUrl: suggestGreenIcon,
    iconAlt: "Suggestions",
    iconFallback: "I",
    label: FILTER_LABELS.suggestion,
  },
];

const REPORT_FILTER_LABELS: Record<ReportFeedFilterValue, string> = {
  hot: "Problèmes les plus signalés",
  rage: "Problèmes les plus rageants",
  popular: "Signalements les plus populaires",
  chrono: "Signalements les plus récents",
  urgent: "À shaker vite",
};

const REPORT_FILTER_OPTIONS: SelectFilterOption<ReportFeedFilterValue>[] = [
  {
    value: "hot",
    emoji: "🔥",
    label: REPORT_FILTER_LABELS.hot,
  },
  {
    value: "rage",
    emoji: "😡",
    label: REPORT_FILTER_LABELS.rage,
  },
  {
    value: "popular",
    emoji: "👍",
    label: REPORT_FILTER_LABELS.popular,
  },
  {
    value: "chrono",
    emoji: "📅",
    label: REPORT_FILTER_LABELS.chrono,
  },
];

const CDC_FILTER_LABELS: Record<CdcFeedFilterValue, string> = {
  popular: "Coups de cœur populaires",
  enflammes: "Coups de cœur les plus enflammés",
  chrono: "Coups de cœur les plus récents",
};

const CDC_FILTER_OPTIONS: SelectFilterOption<CdcFeedFilterValue>[] = [
  {
    value: "popular",
    emoji: "👍",
    label: CDC_FILTER_LABELS.popular,
  },
  {
    value: "enflammes",
    emoji: "❤️‍🔥",
    label: CDC_FILTER_LABELS.enflammes,
  },
  {
    value: "chrono",
    emoji: "💌",
    label: CDC_FILTER_LABELS.chrono,
  },
];

const SUGGESTION_FILTER_LABELS: Record<SuggestionFeedFilterValue, string> = {
  allSuggest: "Suggestions populaires",
  recentSuggestion: "Suggestions ouvertes aux votes",
  likedSuggestion: "Suggestions adoptées",
};

const SUGGESTION_FILTER_OPTIONS: SelectFilterOption<SuggestionFeedFilterValue>[] =
  [
    {
      value: "allSuggest",
      emoji: "👍️",
      label: SUGGESTION_FILTER_LABELS.allSuggest,
    },
    {
      value: "recentSuggestion",
      emoji: "🪄",
      label: SUGGESTION_FILTER_LABELS.recentSuggestion,
    },
    {
      value: "likedSuggestion",
      emoji: "🙌",
      label: SUGGESTION_FILTER_LABELS.likedSuggestion,
    },
  ];

const NEGATIVE_EMOJIS = new Set(["😡", "😤", "🤬", "😠", "😒", "😞", "💢"]);

const getTimestamp = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (!value) continue;

    const parsed = new Date(value).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const getReactionTotal = (
  reactions?: Array<{ count: number; userIds?: string[] }>,
) =>
  (reactions ?? []).reduce((sum, reaction) => sum + (reaction.count ?? 0), 0);

const getReactionBuckets = (
  reactions?: Array<{ count: number; userIds?: string[] }>,
) => (reactions ?? []).filter((reaction) => (reaction.count ?? 0) > 0).length;

const getReportRageScore = (item: ReportFeedItem) => {
  const emojis = [
    item.data.emoji,
    ...item.data.reporters.map((reporter) => reporter.emoji),
  ];
  const negativeCount = emojis.filter((emoji) =>
    NEGATIVE_EMOJIS.has(emoji),
  ).length;

  return (
    negativeCount * 5 + item.data.confirmationsCount + item.data.reportsCount
  );
};

const getReportPopularityScore = (item: ReportFeedItem) =>
  item.data.reportsCount * 3 +
  item.data.confirmationsCount * 2 +
  (item.data.solutionsCount ?? 0) * 2 +
  (item.data.hasBrandResponse ? 3 : 0);

const sortReportsByFilter = (
  items: ReportFeedItem[],
  filter: ReportFeedFilterValue,
) => {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (filter === "hot") {
      return (
        b.data.reportsCount - a.data.reportsCount ||
        b.data.confirmationsCount - a.data.confirmationsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    if (filter === "rage") {
      return (
        getReportRageScore(b) - getReportRageScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    if (filter === "popular") {
      return (
        getReportPopularityScore(b) - getReportPopularityScore(a) ||
        b.data.reportsCount - a.data.reportsCount ||
        getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
          getTimestamp(a.data.latestActivityAt, a.data.createdAt)
      );
    }

    return (
      getTimestamp(b.data.latestActivityAt, b.data.createdAt) -
      getTimestamp(a.data.latestActivityAt, a.data.createdAt)
    );
  });

  return sorted;
};

const sortCdcByFilter = (items: CdcFeedItem[], filter: CdcFeedFilterValue) => {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (filter === "popular") {
      return (
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.updatedAt, b.data.createdAt) -
          getTimestamp(a.data.updatedAt, a.data.createdAt)
      );
    }

    if (filter === "enflammes") {
      return (
        getReactionBuckets(b.data.reactions) -
          getReactionBuckets(a.data.reactions) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.updatedAt, b.data.createdAt) -
          getTimestamp(a.data.updatedAt, a.data.createdAt)
      );
    }

    return (
      getTimestamp(b.data.createdAt, b.data.updatedAt) -
      getTimestamp(a.data.createdAt, a.data.updatedAt)
    );
  });

  return sorted;
};

const sortSuggestionsByFilter = (
  items: SuggestionFeedItem[],
  filter: SuggestionFeedFilterValue,
) => {
  const filtered =
    filter === "recentSuggestion"
      ? items.filter((item) => !item.data.isAdopted)
      : filter === "likedSuggestion"
        ? items.filter((item) => Boolean(item.data.isAdopted))
        : items;

  const sorted = [...filtered];

  sorted.sort((a, b) => {
    if (filter === "allSuggest") {
      return (
        (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
        (b.data.duplicateCount ?? 0) - (a.data.duplicateCount ?? 0) ||
        getReactionTotal(b.data.reactions) -
          getReactionTotal(a.data.reactions) ||
        getTimestamp(b.data.createdAt, b.data.updatedAt) -
          getTimestamp(a.data.createdAt, a.data.updatedAt)
      );
    }

    if (filter === "recentSuggestion") {
      return (
        getTimestamp(b.data.createdAt, b.data.updatedAt) -
          getTimestamp(a.data.createdAt, a.data.updatedAt) ||
        (b.data.votes ?? 0) - (a.data.votes ?? 0)
      );
    }

    return (
      (b.data.votes ?? 0) - (a.data.votes ?? 0) ||
      getReactionTotal(b.data.reactions) - getReactionTotal(a.data.reactions) ||
      getTimestamp(b.data.createdAt, b.data.updatedAt) -
        getTimestamp(a.data.createdAt, a.data.updatedAt)
    );
  });

  return sorted;
};

const MixedFeed: React.FC<Props> = ({
  isPublic = false,
  onPublicFiltersChange,
}) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FeedFilterValue>("all");
  const [reportFeedFilter, setReportFeedFilter] =
    useState<ReportFeedFilterValue>("chrono");
  const [cdcFeedFilter, setCdcFeedFilter] =
    useState<CdcFeedFilterValue>("chrono");
  const [suggestionFeedFilter, setSuggestionFeedFilter] =
    useState<SuggestionFeedFilterValue>("allSuggest");
  const navigate = useNavigate();
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const typeFilteredFeed = useMemo(() => {
    if (selectedFilter === "all") {
      return feed;
    }

    return feed.filter((item) =>
      selectedFilter === "coupdecoeur"
        ? item.type === "cdc"
        : item.type === selectedFilter,
    );
  }, [feed, selectedFilter]);

  const publicationFilteredFeed = useMemo(() => {
    if (selectedFilter === "report") {
      return sortReportsByFilter(
        typeFilteredFeed.filter(
          (item): item is ReportFeedItem => item.type === "report",
        ),
        reportFeedFilter,
      );
    }

    if (selectedFilter === "coupdecoeur") {
      return sortCdcByFilter(
        typeFilteredFeed.filter(
          (item): item is CdcFeedItem => item.type === "cdc",
        ),
        cdcFeedFilter,
      );
    }

    if (selectedFilter === "suggestion") {
      return sortSuggestionsByFilter(
        typeFilteredFeed.filter(
          (item): item is SuggestionFeedItem => item.type === "suggestion",
        ),
        suggestionFeedFilter,
      );
    }

    return typeFilteredFeed;
  }, [
    cdcFeedFilter,
    reportFeedFilter,
    selectedFilter,
    suggestionFeedFilter,
    typeFilteredFeed,
  ]);

  const filteredFeed = useMemo(
    () => filterFeedItems(publicationFilteredFeed, searchValue),
    [publicationFilteredFeed, searchValue],
  );

  const hasSearchQuery = Boolean(searchValue.trim());
  const hasTypeFilter = selectedFilter !== "all";
  const showSecondaryFilter = isPublic && selectedFilter !== "all";

  const activeSecondaryFilterLabel = useMemo(() => {
    if (selectedFilter === "report") {
      return REPORT_FILTER_LABELS[reportFeedFilter];
    }

    if (selectedFilter === "coupdecoeur") {
      return CDC_FILTER_LABELS[cdcFeedFilter];
    }

    if (selectedFilter === "suggestion") {
      return SUGGESTION_FILTER_LABELS[suggestionFeedFilter];
    }

    return "";
  }, [cdcFeedFilter, reportFeedFilter, selectedFilter, suggestionFeedFilter]);

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

  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };

  const handleFilter = (type: FeedFilterValue) => {
    if (isPublic) {
      setSelectedFilter(type);
      return;
    }

    if (type === "all") return;

    if (!isAuthenticated) {
      if (type === "report") {
        triggerTooltip("Connecte-toi pour voir les signalements");
      } else if (type === "coupdecoeur") {
        triggerTooltip("Connecte-toi pour voir les coups de cœur");
      } else if (type === "suggestion") {
        triggerTooltip("Connecte-toi pour voir les suggestions");
      } else {
        triggerTooltip("Connecte-toi pour continuer");
      }
      return;
    }

    navigate(`/feedback?tab=${type}`);
  };

  return (
    <div className="mixed-feed">
      <div className="feed-header">
        <div className="feed-header__top">
          <div className="primary-filters">
            <Champs
              options={FILTER_OPTIONS}
              value={selectedFilter}
              onChange={handleFilter}
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
                  onChange={setReportFeedFilter}
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
                  onChange={setCdcFeedFilter}
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
                  onChange={setSuggestionFeedFilter}
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
              onChange={setSearchValue}
              onClear={() => setSearchValue("")}
              className="feed-header__search"
              placeholder="Rechercher une publication"
              ariaLabel="Rechercher dans les publications affichées"
            />
          )}
        </div>
      </div>

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

      {filteredFeed.map((item) => {
        const id =
          item.type === "report"
            ? item.data.reportingId
            : (item.data.id ?? item.data.title);

        return (
          <FeedItemRenderer
            key={`${item.type}-${id}`}
            item={item}
            isOpen={true}
            isPublic={isPublic}
          />
        );
      })}

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
