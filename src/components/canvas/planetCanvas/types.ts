export type PopFeedTheme = "report" | "suggestion" | "coupDeCoeur";

export type PlanetCanvasPosition = {
  x: number;
  y: number;
};

export type PlanetPopFeedBubble = {
  id: string;
  message: string;
  delayMs: number;
  brandImage: string;
};

export type PlanetPopFeedItemData = {
  id: string;
  theme: PopFeedTheme;
  image: string;
  appearanceDelayMs: number;
  position: PlanetCanvasPosition;
  rotation: number;
  bubbles: PlanetPopFeedBubble[];
};

export type PlanetPopFeedThemeConfig = {
  icon: string;
  surface: string;
  border: string;
  shadow: string;
  messages: readonly string[];
  linkedMessages?: readonly string[];
};
