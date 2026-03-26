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
        statsMode: "report-chrono",
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

    if (filters.cdcFeedFilter === "enflammes") {
      return {
        filter: filters.cdcFeedFilter,
        onglet: "coupdecoeur",
        text: "Les coups de cœur qui embrasent le plus la communauté.",
        themeClass: "right-sidebar--theme-cdc",
        statsMode: "cdc-enflammes",
      };
    }

    return {
      filter: filters.cdcFeedFilter,
      onglet: "coupdecoeur",
      text: "Les derniers coups de cœur partagés par la communauté.",
      themeClass: "right-sidebar--theme-cdc",
      statsMode: "cdc-chrono",
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

  if (filters.suggestionFeedFilter === "recentSuggestion") {
    return {
      filter: filters.suggestionFeedFilter,
      onglet: "suggestion",
      text: "Les suggestions encore ouvertes aux votes de la communauté.",
      themeClass: "right-sidebar--theme-suggest",
      statsMode: "suggestion-recent",
    };
  }

  return {
    filter: filters.suggestionFeedFilter,
    onglet: "suggestion",
    text: "Les suggestions déjà adoptées et validées collectivement.",
    themeClass: "right-sidebar--theme-suggest",
    statsMode: "suggestion-liked",
  };
};
