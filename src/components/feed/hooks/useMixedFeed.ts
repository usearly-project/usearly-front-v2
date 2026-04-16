import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import { useAuth } from "@src/services/AuthContext";
import { filterFeedItems } from "@src/utils/feedSearch";
import type { FeedItem } from "@src/types/feedItem";
import type {
  FeedFilterValue,
  FeedBrandFilterOption,
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
import { useAuthTooltip } from "@src/hooks/useAuthTooltip";

// Note : On pourrait aussi mettre ces labels dans un fichier constants
const REPORT_FILTER_LABELS: Record<ReportFeedFilterValue, string> = {
  hot: "Les plus signalés",
  rage: "Les plus rageants",
  popular: "Les plus populaires",
  chrono: "Les plus récents",
  urgent: "À shaker vite",
};

const CDC_FILTER_LABELS: Record<CdcFeedFilterValue, string> = {
  popular: "Populaires",
  enflammes: "Les plus enflammés",
  chrono: "Les plus récents",
};

const SUGGESTION_FILTER_LABELS: Record<SuggestionFeedFilterValue, string> = {
  allSuggest: "Populaires",
  recentSuggestion: "Ouvertes aux votes",
  likedSuggestion: "Adoptées",
};

const normalizeBrandName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getFeedItemBrand = (item: FeedItem) =>
  String(item.data.marque ?? "").trim();

const getFeedItemSiteUrl = (item: FeedItem) => {
  const siteUrl = item.data.siteUrl;
  return typeof siteUrl === "string" && siteUrl.trim()
    ? siteUrl.trim()
    : undefined;
};

export const useMixedFeed = (
  isPublic: boolean,
  onPublicFiltersChange?: (filters: PublicFeedFilterState) => void,
  isMobile = false,
) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [searchValue, setSearchValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const { showAuthTooltip, tooltipText, tooltipPosition, triggerTooltip } =
    useAuthTooltip();

  const location = useLocation();
  const navigate = useNavigate();

  const VALID_TABS: FeedFilterValue[] = ["report", "coupdecoeur", "suggestion"];

  const [reportFeedFilter, setReportFeedFilter] =
    useState<ReportFeedFilterValue>("chrono");
  const [cdcFeedFilter, setCdcFeedFilter] =
    useState<CdcFeedFilterValue>("chrono");
  const [suggestionFeedFilter, setSuggestionFeedFilter] =
    useState<SuggestionFeedFilterValue>("allSuggest");

  const availableBrands = useMemo<FeedBrandFilterOption[]>(() => {
    const brandMap = new Map<string, FeedBrandFilterOption>();

    feed.forEach((item) => {
      const brand = getFeedItemBrand(item);
      if (!brand) return;

      const key = normalizeBrandName(brand);
      const siteUrl = getFeedItemSiteUrl(item);
      const existing = brandMap.get(key);

      if (!existing) {
        brandMap.set(key, { brand, siteUrl });
        return;
      }

      if (siteUrl && !existing.siteUrl) {
        existing.siteUrl = siteUrl;
      }
    });

    return Array.from(brandMap.values()).sort((a, b) =>
      a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }),
    );
  }, [feed]);

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

    const normalizedSelectedBrand = normalizeBrandName(selectedBrand);
    const brandFiltered =
      isMobile && normalizedSelectedBrand
        ? typeFiltered.filter(
            (item) =>
              normalizeBrandName(getFeedItemBrand(item)) ===
              normalizedSelectedBrand,
          )
        : typeFiltered;

    let sorted = brandFiltered;
    if (selectedFilter === "report") {
      sorted = sortReportsByFilter(brandFiltered as any, reportFeedFilter);
    } else if (selectedFilter === "coupdecoeur") {
      sorted = sortCdcByFilter(brandFiltered as any, cdcFeedFilter);
    } else if (selectedFilter === "suggestion") {
      sorted = sortSuggestionsByFilter(
        brandFiltered as any,
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
    selectedBrand,
    isMobile,
  ]);

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
    if (!isMobile && selectedBrand) {
      setSelectedBrand("");
    }
  }, [isMobile, selectedBrand]);

  useEffect(() => {
    if (isPublic && onPublicFiltersChange) {
      onPublicFiltersChange({
        selectedFilter,
        reportFeedFilter,
        cdcFeedFilter,
        suggestionFeedFilter,
        selectedBrand: isMobile ? selectedBrand : "",
      });
    }
  }, [
    selectedFilter,
    reportFeedFilter,
    cdcFeedFilter,
    suggestionFeedFilter,
    selectedBrand,
    isMobile,
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
  };
};
