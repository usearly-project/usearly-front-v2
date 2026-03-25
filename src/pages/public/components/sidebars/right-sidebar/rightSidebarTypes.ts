export type RightSidebarStatsMode =
  | "default"
  | "none"
  | "report-rage"
  | "report-popular"
  | "cdc-popular"
  | "suggestion-popular";

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
