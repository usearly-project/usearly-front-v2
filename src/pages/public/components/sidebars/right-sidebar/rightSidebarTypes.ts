export type RightSidebarStatsMode =
  | "default"
  | "none"
  | "report-chrono"
  | "report-rage"
  | "report-popular"
  | "cdc-popular"
  | "cdc-chrono"
  | "cdc-enflammes"
  | "suggestion-popular"
  | "suggestion-recent"
  | "suggestion-liked";

export type RightSidebarThemeClass =
  | "right-sidebar--theme-report"
  | "right-sidebar--theme-cdc"
  | "right-sidebar--theme-suggest";

export type RightSidebarOnglet = "report" | "coupdecoeur" | "suggestion";

export interface RightSidebarStatItem {
  value: number;
  singular: string;
  plural: string;
  suffix?: string;
}

export interface RightSidebarIllustrationConfig {
  filter: string;
  onglet: RightSidebarOnglet;
  text?: string;
  themeClass: RightSidebarThemeClass;
  statsMode: RightSidebarStatsMode;
}
