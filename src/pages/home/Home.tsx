import { useState, useCallback, useMemo, useEffect } from "react";
import "./Home.scss";
import type { FeedbackType } from "@src/types/Reports";
import { useFeedbackData } from "./hooks/useFeedbackData";
import { useBrandColors } from "./hooks/useBrandColors";
import { useCategories } from "./hooks/useCategories";
import { useIsAtBottom } from "@src/hooks/detect-bottom";
import { useIsMobile } from "@src/hooks/use-mobile";
import ReportTab from "./home-tabs/ReportTab";
import CdcTabEnhanced from "./home-tabs/CdcTabEnhanced";
import SuggestionTabEnhanced from "./home-tabs/SuggestionTabEnhanced";
import SearchBar from "./components/searchBar/SearchBar";
import FeedbackRightSidebar from "./home-tabs/FeedbackRightSidebar";
import LeftSidebar from "../public/components/sidebars/LeftSidebar";
import HeroBanner from "../public/components/HeroBanner/HeroBanner";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useBrands } from "@src/hooks/useBrands";
import {
  findBrandBySlug,
  getFeedbackBrandPath,
  getFeedbackPath,
  getFeedbackTabFromPathSegment,
  uniqueBrandsBySlug,
} from "@src/utils/brandSlug";
import type { BrandReportStats } from "./home-grouped-reports-list/utils/brandReportStats";

const FEEDBACK_LIST_WRAPPER_SELECTOR = ".feedback-list-wrapper";
const BOTTOM_THRESHOLD_PX = 12;
const getDefaultActiveFilter = (tab: FeedbackType) =>
  tab === "suggestion" ? "allSuggest" : "chrono";

const getBrandActiveFilter = (tab: FeedbackType) =>
  tab === "report" ? "" : "brandSolo";

type ExtendedTab = FeedbackType | "all";

const VALID_TABS: ExtendedTab[] = [
  "all",
  "report",
  "coupdecoeur",
  "suggestion",
];

const FEEDBACK_TABS: FeedbackType[] = ["report", "coupdecoeur", "suggestion"];

const getDefaultFilters = (tab: FeedbackType) => ({
  selectedBrand: "",
  selectedCategory: "",
  selectedMainCategory: "",
  activeFilter: getDefaultActiveFilter(tab),
  suggestionSearch: "",
  selectedSiteUrl: undefined as string | undefined,
});

const isScrollableElement = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const overflowY = styles.overflowY;
  const canScrollY =
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canScrollY && element.scrollHeight > element.clientHeight + 1;
};

const getFeedbackScrollableAncestors = () => {
  if (typeof window === "undefined") return [] as HTMLElement[];

  const feedbackList = document.querySelector<HTMLElement>(
    FEEDBACK_LIST_WRAPPER_SELECTOR,
  );
  if (!feedbackList) return [] as HTMLElement[];

  const ancestors: HTMLElement[] = [];
  let current: HTMLElement | null = feedbackList;

  while (current) {
    if (isScrollableElement(current)) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }

  return ancestors;
};

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("chrono");
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as FeedbackType | null;
  const navigate = useNavigate();
  const location = useLocation();
  const { brandSlug, feedbackKind } = useParams<{
    brandSlug?: string;
    feedbackKind?: string;
  }>();
  const isBrandRoute = Boolean(brandSlug);
  const tabFromPath = getFeedbackTabFromPathSegment(feedbackKind);
  //const validTabs: FeedbackType[] = ["report", "coupdecoeur", "suggestion"];
  const safeTab: FeedbackType =
    isBrandRoute && tabFromPath
      ? tabFromPath
      : tabFromUrl && FEEDBACK_TABS.includes(tabFromUrl)
        ? tabFromUrl
        : "report";

  const { brands: reportBrandLookup, loading: reportBrandsLoading } = useBrands(
    "report",
    { enabled: isBrandRoute },
  );
  const { brands: cdcBrandLookup, loading: cdcBrandsLoading } = useBrands(
    "coupdecoeur",
    { enabled: isBrandRoute },
  );
  const { brands: suggestionBrandLookup, loading: suggestionBrandsLoading } =
    useBrands("suggestion", { enabled: isBrandRoute });

  const currentTabBrandLookup = useMemo(() => {
    if (safeTab === "coupdecoeur") return cdcBrandLookup;
    if (safeTab === "suggestion") return suggestionBrandLookup;
    return reportBrandLookup;
  }, [safeTab, cdcBrandLookup, reportBrandLookup, suggestionBrandLookup]);
  const [brandReportStats, setBrandReportStats] =
    useState<BrandReportStats | null>(null);
  const allBrandLookup = useMemo(
    () =>
      uniqueBrandsBySlug([
        ...reportBrandLookup,
        ...cdcBrandLookup,
        ...suggestionBrandLookup,
      ]),
    [cdcBrandLookup, reportBrandLookup, suggestionBrandLookup],
  );

  const resolvedRouteBrand = useMemo(() => {
    if (!brandSlug) return null;
    return (
      findBrandBySlug(currentTabBrandLookup, brandSlug) ||
      findBrandBySlug(allBrandLookup, brandSlug)
    );
  }, [allBrandLookup, brandSlug, currentTabBrandLookup]);

  const isAnyBrandLookupLoading =
    reportBrandsLoading || cdcBrandsLoading || suggestionBrandsLoading;
  const isBrandLookupLoading =
    isBrandRoute && !resolvedRouteBrand && isAnyBrandLookupLoading;
  const isBrandRouteNotFound =
    isBrandRoute && !isBrandLookupLoading && !resolvedRouteBrand;
  const routeSelectedBrand =
    isBrandRoute && resolvedRouteBrand ? resolvedRouteBrand.marque : "";
  const currentSelectedBrand = routeSelectedBrand || selectedBrand;
  const currentSelectedSiteUrl =
    isBrandRoute && resolvedRouteBrand
      ? resolvedRouteBrand.siteUrl || selectedSiteUrl
      : selectedSiteUrl;

  const isAtBottom = useIsAtBottom({
    thresholdPx: BOTTOM_THRESHOLD_PX,
    anchorSelector: FEEDBACK_LIST_WRAPPER_SELECTOR,
  });
  const isMobile = useIsMobile("(max-width: 1220px)");

  useEffect(() => {
    document.body.classList.add("feedback-route");
    document.documentElement.classList.add("feedback-route");

    return () => {
      document.body.classList.remove("feedback-route");
      document.documentElement.classList.remove("feedback-route");
    };
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (isBrandRoute) return;

    // ✅ si pas de tab → on laisse tranquille (mode "all" ou "/")
    if (!tab) return;

    //const validTabs: FeedbackType[] = ["report", "coupdecoeur", "suggestion"];

    // ❌ uniquement si invalide
    if (!VALID_TABS.includes(tab as ExtendedTab)) {
      navigate("/feedback", { replace: true });
    }
  }, [isBrandRoute, navigate, searchParams]);

  useEffect(() => {
    if (safeTab !== activeTab) {
      const defaults = getDefaultFilters(safeTab);

      if (!isBrandRoute) {
        setSelectedBrand(defaults.selectedBrand);
      }
      setSelectedCategory(defaults.selectedCategory);
      setSelectedMainCategory(defaults.selectedMainCategory);
      setActiveFilter(
        isBrandRoute ? getBrandActiveFilter(safeTab) : defaults.activeFilter,
      );
      setSuggestionSearch(defaults.suggestionSearch);
      if (!isBrandRoute) {
        setSelectedSiteUrl(defaults.selectedSiteUrl);
      }
      setReportSearchTerm("");

      setActiveTab(safeTab);
    }
  }, [activeTab, isBrandRoute, safeTab]);
  const handleTabChange = useCallback(
    (nextTab: FeedbackType) => {
      if (nextTab === activeTab) return;

      const defaults = getDefaultFilters(nextTab);
      setSelectedCategory(defaults.selectedCategory);
      setSelectedMainCategory(defaults.selectedMainCategory);
      setActiveFilter(
        currentSelectedBrand
          ? getBrandActiveFilter(nextTab)
          : defaults.activeFilter,
      );
      setSuggestionSearch(defaults.suggestionSearch);
      setReportSearchTerm("");

      if (currentSelectedBrand) {
        navigate(getFeedbackBrandPath(currentSelectedBrand, nextTab));
      } else {
        setSelectedBrand(defaults.selectedBrand);
        setSelectedSiteUrl(defaults.selectedSiteUrl);
        navigate(getFeedbackPath(nextTab));
      }
      //setActiveTab(nextTab);
    },
    [activeTab, currentSelectedBrand, navigate],
  );

  useEffect(() => {
    if (activeTab !== "report") {
      setReportSearchTerm("");
    }
  }, [activeTab]);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });

    const scrollableAncestors = getFeedbackScrollableAncestors();
    scrollableAncestors.forEach((ancestor) => {
      ancestor.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (isBrandRoute) return;

    setSelectedBrand("");
    setSelectedSiteUrl(undefined);
  }, [isBrandRoute, location.pathname]);

  useEffect(() => {
    if (!isBrandRoute || !resolvedRouteBrand) return;

    const canonicalPath = getFeedbackBrandPath(
      resolvedRouteBrand.marque,
      safeTab,
    );
    const currentPath = `${location.pathname}${location.search}`;

    if (currentPath !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }

    setSelectedBrand(resolvedRouteBrand.marque);
    setSelectedSiteUrl(resolvedRouteBrand.siteUrl);
    setSelectedCategory("");
    setSelectedMainCategory("");
    setSuggestionSearch("");
    setActiveFilter(getBrandActiveFilter(safeTab));
    setReportSearchTerm("");
  }, [
    isBrandRoute,
    location.pathname,
    location.search,
    navigate,
    resolvedRouteBrand,
    safeTab,
  ]);

  // ✅ Gestion de la marque
  const handleSetBrand = useCallback(
    (brand: string, siteUrl?: string) => {
      const normalizedBrand = brand.trim();

      if (!normalizedBrand) {
        setSelectedBrand("");
        setSelectedSiteUrl(undefined);
        navigate(getFeedbackPath(activeTab));
        return;
      }

      setSelectedBrand(normalizedBrand);
      setSelectedSiteUrl(siteUrl);

      const nextPath = getFeedbackBrandPath(normalizedBrand, activeTab);
      const currentPath = `${location.pathname}${location.search}`;

      if (currentPath !== nextPath) {
        navigate(nextPath);
      }
    },
    [activeTab, location.pathname, location.search, navigate],
  );

  // ✅ Appel du hook au niveau du composant (conforme aux règles React)
  const {
    feedbackData,
    isLoading,
    isInitialLoading,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
    hasMore,
    loadMore,
  } = useFeedbackData(
    activeTab,
    activeFilter,
    currentSelectedBrand,
    selectedCategory,
    suggestionSearch,
  );

  const { brandBannerStyle, suggestionBannerStyle } = useBrandColors(
    activeTab,
    currentSelectedBrand,
    feedbackData,
    currentSelectedSiteUrl,
  );

  const { suggestionCategories, coupDeCoeurCategories } = useCategories(
    activeTab,
    feedbackData,
    currentSelectedBrand,
  );
  const shouldColorRightPanel =
    Boolean(currentSelectedBrand) &&
    (activeTab === "coupdecoeur" || activeTab === "suggestion");

  const handleSuggestionBrandChange = useCallback(
    (brand: string, siteUrl?: string) => {
      handleSetBrand(brand, siteUrl);
      setSelectedCategory("");
      setSelectedMainCategory("");
      setSuggestionSearch("");
      setActiveFilter(brand ? "brandSolo" : "allSuggest");
    },
    [handleSetBrand],
  );

  const totalCount = displayedCount;

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return [];
    if (activeTab === "coupdecoeur") return coupDeCoeursForDisplay;
    if (activeTab === "suggestion") return suggestionsForDisplay;
    return [];
  }, [
    activeTab,
    selectedCategory,
    coupDeCoeursForDisplay,
    suggestionsForDisplay,
  ]);

  if (isBrandLookupLoading || isBrandRouteNotFound) {
    return (
      <div className="home-page">
        <HeroBanner />
        <main className="feedback-brand-state">
          <div className="feedback-brand-state__panel">
            {isBrandLookupLoading ? (
              <>
                <p className="feedback-brand-state__eyebrow">Page marque</p>
                <h1>Chargement de la marque...</h1>
                <p>On prépare les feedbacks associés à cette marque.</p>
              </>
            ) : (
              <>
                <p className="feedback-brand-state__eyebrow">
                  Marque introuvable
                </p>
                <h1>Aucun feedback pour cette marque</h1>
                <p>
                  La marque demandée n'existe pas ou l'adresse ne correspond à
                  aucune marque connue.
                </p>
                <Link
                  className="feedback-brand-state__link"
                  to={getFeedbackPath(safeTab)}
                >
                  Revenir aux feedbacks
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <HeroBanner onTabChange={handleTabChange} />

      <main className={`user-main-content ${isMobile ? "is-mobile" : ""}`}>
        <aside className="left-panel">
          {/* <LeftSidebar activeTab={activeTab} feedbackData={feedbackData} /> */}
          <LeftSidebar
            activeTab={activeTab}
            feedbackData={feedbackData}
            brandReportStats={brandReportStats}
            selectedBrand={currentSelectedBrand} // <--- INDISPENSABLE
            selectedSiteUrl={currentSelectedSiteUrl} // <--- INDISPENSABLE
          />
        </aside>

        {activeTab === "report" && (
          <ReportTab
            activeFilter={activeFilter}
            onBrandReportStatsChange={setBrandReportStats}
            setActiveFilter={setActiveFilter}
            onThemeChange={handleTabChange}
            selectedBrand={currentSelectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMainCategory={selectedMainCategory}
            setSelectedMainCategory={setSelectedMainCategory}
            setSelectedSiteUrl={setSelectedSiteUrl}
            brandBannerStyle={brandBannerStyle}
            selectedSiteUrl={currentSelectedSiteUrl}
            displayedCount={displayedCount}
            searchTerm={reportSearchTerm}
            onSearchTermChange={setReportSearchTerm}
            showRightPanel={!isMobile}
          />
        )}

        {activeTab === "coupdecoeur" && (
          <CdcTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onThemeChange={handleTabChange}
            selectedBrand={currentSelectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brandBannerStyle={brandBannerStyle}
            coupDeCoeurCategories={coupDeCoeurCategories}
            coupDeCoeursForDisplay={coupDeCoeursForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={currentSelectedSiteUrl}
            setSelectedSiteUrl={setSelectedSiteUrl}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            showRightPanel={!isMobile}
          />
        )}

        {activeTab === "suggestion" && (
          <SuggestionTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onThemeChange={handleTabChange}
            selectedBrand={currentSelectedBrand}
            handleSuggestionBrandChange={handleSuggestionBrandChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            suggestionCategories={suggestionCategories}
            suggestionSearch={suggestionSearch}
            setSuggestionSearch={setSuggestionSearch}
            suggestionBannerStyle={suggestionBannerStyle}
            brandBannerStyle={brandBannerStyle}
            suggestionsForDisplay={suggestionsForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={currentSelectedSiteUrl}
            isLoading={isLoading}
            showRightPanel={!isMobile}
          />
        )}
        <aside
          className={`right-panel ${shouldColorRightPanel ? "right-panel--brand-colored" : ""}`}
          style={shouldColorRightPanel ? brandBannerStyle : undefined}
        >
          <div className="home-mobile-right-panel">
            {activeTab === "report" && (
              <SearchBar
                value={reportSearchTerm}
                onChange={setReportSearchTerm}
                placeholder="Rechercher un signalement"
              />
            )}
            <FeedbackRightSidebar
              activeTab={activeTab}
              activeFilter={activeFilter}
              selectedBrand={currentSelectedBrand}
              selectedCategory={selectedCategory}
              selectedSiteUrl={currentSelectedSiteUrl}
              brandBannerStyle={brandBannerStyle}
            />
          </div>
        </aside>
      </main>

      {isAtBottom && (
        <button
          type="button"
          className="feedback-scroll-top-fab is-visible"
          onClick={scrollToTop}
          aria-label="Remonter en haut"
          title="Remonter en haut"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;
