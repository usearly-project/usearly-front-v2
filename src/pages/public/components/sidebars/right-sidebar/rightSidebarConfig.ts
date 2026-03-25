import type { PublicFeedFilterState } from "@src/components/feed/feedFilterTypes";
import type { RightSidebarIllustrationConfig } from "./rightSidebarTypes";

export const resolveRightSidebarIllustrationConfig = (
  filters?: PublicFeedFilterState,
): RightSidebarIllustrationConfig | null => {
  if (!filters || filters.selectedFilter === "all") {
    return null;
  }

  if (filters.selectedFilter === "report") {
    if (filters.reportFeedFilter === "hot") {
      return null;
    }

    if (filters.reportFeedFilter === "rage") {
      return {
        filter: filters.reportFeedFilter,
        onglet: "report",
        text: "Les problèmes les plus agaçant pour la communauté !",
        themeClass: "right-sidebar--theme-report",
        statsMode: "report-rage",
      };
    }

    if (filters.reportFeedFilter === "chrono") {
      return {
        filter: filters.reportFeedFilter,
        onglet: "report",
        text: "Les nouveaux tickets à confirmer avec de nouveaux signalements",
        themeClass: "right-sidebar--theme-report",
        statsMode: "none",
      };
    }

    if (filters.reportFeedFilter === "popular") {
      return {
        filter: filters.reportFeedFilter,
        onglet: "report",
        text: "Les problèmes qui font réagir la communauté en ce moment.",
        themeClass: "right-sidebar--theme-report",
        statsMode: "report-popular",
      };
    }

    return {
      filter: filters.reportFeedFilter,
      onglet: "report",
      themeClass: "right-sidebar--theme-report",
      statsMode: "none",
    };
  }

  if (filters.selectedFilter === "coupdecoeur") {
    if (filters.cdcFeedFilter === "popular") {
      return {
        filter: filters.cdcFeedFilter,
        onglet: "coupdecoeur",
        text: "Les coups de coeur de la communauté",
        themeClass: "right-sidebar--theme-cdc",
        statsMode: "cdc-popular",
      };
    }

    return {
      filter: filters.cdcFeedFilter,
      onglet: "coupdecoeur",
      themeClass: "right-sidebar--theme-cdc",
      statsMode: "none",
    };
  }

  if (filters.suggestionFeedFilter === "allSuggest") {
    return {
      filter: filters.suggestionFeedFilter,
      onglet: "suggestion",
      text: "Les suggestions qui font le plus réagir la communauté !",
      themeClass: "right-sidebar--theme-suggest",
      statsMode: "suggestion-popular",
    };
  }

  return {
    filter: filters.suggestionFeedFilter,
    onglet: "suggestion",
    themeClass: "right-sidebar--theme-suggest",
    statsMode: "none",
  };
};
