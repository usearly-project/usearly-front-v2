import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import { useAuth } from "@src/services/AuthContext";
import { filterFeedItems } from "@src/utils/feedSearch";
import type {
  FeedFilterValue,
  ReportFeedFilterValue,
  CdcFeedFilterValue,
  SuggestionFeedFilterValue,
  PublicFeedFilterState,
} from "../types/feedFilterTypes";

// On importe nos fonctions de tri et nos labels de l'utilitaire
import {
  sortReportsByFilter,
  sortCdcByFilter,
  sortSuggestionsByFilter,
} from "../utils/MixedFeed.utils";

// Note : On pourrait aussi mettre ces labels dans un fichier constants
const REPORT_FILTER_LABELS: Record<ReportFeedFilterValue, string> = {
  hot: "Problèmes les plus signalés",
  rage: "Problèmes les plus rageants",
  popular: "Signalements les plus populaires",
  chrono: "Signalements les plus récents",
  urgent: "À shaker vite",
};

const CDC_FILTER_LABELS: Record<CdcFeedFilterValue, string> = {
  popular: "Coups de cœur populaires",
  enflammes: "Coups de cœur les plus enflammés",
  chrono: "Coups de cœur les plus récents",
};

const SUGGESTION_FILTER_LABELS: Record<SuggestionFeedFilterValue, string> = {
  allSuggest: "Suggestions populaires",
  recentSuggestion: "Suggestions ouvertes aux votes",
  likedSuggestion: "Suggestions adoptées",
};

export const useMixedFeed = (
  isPublic: boolean,
  onPublicFiltersChange?: (filters: PublicFeedFilterState) => void,
) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [searchValue, setSearchValue] = useState("");
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const VALID_TABS: FeedFilterValue[] = ["report", "coupdecoeur", "suggestion"];

  const [reportFeedFilter, setReportFeedFilter] =
    useState<ReportFeedFilterValue>("chrono");
  const [cdcFeedFilter, setCdcFeedFilter] =
    useState<CdcFeedFilterValue>("chrono");
  const [suggestionFeedFilter, setSuggestionFeedFilter] =
    useState<SuggestionFeedFilterValue>("allSuggest");

  // --- LOGIQUE DE L'URL ---
  const selectedFilter: FeedFilterValue = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (!tab) return "all";
    return VALID_TABS.includes(tab as FeedFilterValue)
      ? (tab as FeedFilterValue)
      : "report";
  }, [location.search]);

  // --- FILTRAGE ET TRI ---
  const filteredFeed = useMemo(() => {
    const typeFiltered =
      selectedFilter === "all"
        ? feed
        : feed.filter((item) =>
            selectedFilter === "coupdecoeur"
              ? item.type === "cdc"
              : item.type === selectedFilter,
          );

    let sorted = typeFiltered;
    if (selectedFilter === "report") {
      sorted = sortReportsByFilter(typeFiltered as any, reportFeedFilter);
    } else if (selectedFilter === "coupdecoeur") {
      sorted = sortCdcByFilter(typeFiltered as any, cdcFeedFilter);
    } else if (selectedFilter === "suggestion") {
      sorted = sortSuggestionsByFilter(
        typeFiltered as any,
        suggestionFeedFilter,
      );
    }

    return filterFeedItems(sorted, searchValue);
  }, [
    feed,
    selectedFilter,
    reportFeedFilter,
    cdcFeedFilter,
    suggestionFeedFilter,
    searchValue,
  ]);

  // --- ACTIONS ---
  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);
    setTimeout(() => setShowAuthTooltip(false), 2000);
  };

  const handleFilter = (type: FeedFilterValue) => {
    if (type === "all") {
      navigate("/", { replace: true });
      return;
    }

    if (!isAuthenticated) {
      const messages: Record<string, string> = {
        report: "Connecte-toi pour voir les signalements",
        coupdecoeur: "Connecte-toi pour voir les coups de cœur",
        suggestion: "Connecte-toi pour voir les suggestions",
      };
      triggerTooltip(messages[type] || "Connecte-toi pour continuer");
      return;
    }

    navigate(`/feedback?tab=${type}`);
  };

  const activeSecondaryFilterLabel = useMemo(() => {
    if (selectedFilter === "report")
      return REPORT_FILTER_LABELS[reportFeedFilter];
    if (selectedFilter === "coupdecoeur")
      return CDC_FILTER_LABELS[cdcFeedFilter];
    if (selectedFilter === "suggestion")
      return SUGGESTION_FILTER_LABELS[suggestionFeedFilter];
    return "";
  }, [selectedFilter, reportFeedFilter, cdcFeedFilter, suggestionFeedFilter]);

  // --- EFFETS ---
  useEffect(() => {
    if (isPublic && selectedFilter !== "all") setSearchValue("");
  }, [selectedFilter, isPublic]);

  useEffect(() => {
    if (isPublic && onPublicFiltersChange) {
      onPublicFiltersChange({
        selectedFilter,
        reportFeedFilter,
        cdcFeedFilter,
        suggestionFeedFilter,
      });
    }
  }, [
    selectedFilter,
    reportFeedFilter,
    cdcFeedFilter,
    suggestionFeedFilter,
    isPublic,
    onPublicFiltersChange,
  ]);

  return {
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
  };
};
