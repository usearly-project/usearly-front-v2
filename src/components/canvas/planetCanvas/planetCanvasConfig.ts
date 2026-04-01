import reportIcon from "/assets/icons/reportYellowIcon.svg";
import heartIcon from "/assets/icons/cdc-icon.svg";
import suggestionIcon from "/assets/icons/suggest-icon.svg";
import { pickRandomValue } from "./planetCanvasUtils";
import type {
  PlanetPopFeedBrandConfig,
  PlanetPopFeedBrandMessage,
  PlanetPopFeedThemeConfig,
  PopFeedTheme,
} from "./types";
import { POP_FEED_BRANDS } from "./planetPopFeedBrands";

export const PLANET_CANVAS_TRAIL_IMAGES = Array.from(
  { length: 13 },
  (_, index) => `/assets/images/about/imageAbout${index + 1}.png`,
);

export const POP_FEED_LIFETIME_MS = 5000;
export const POP_FEED_MAX_ATTEMPTS = 12;

export { POP_FEED_BRANDS };

export const POP_FEED_THEME_CONFIG: Record<
  PopFeedTheme,
  PlanetPopFeedThemeConfig
> = {
  report: {
    icon: reportIcon,
    surface: "#4E8CFF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
  suggestion: {
    icon: suggestionIcon,
    surface: "#37D48B",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
  coupDeCoeur: {
    icon: heartIcon,
    surface: "#A688FF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
};

const FALLBACK_MESSAGE_BY_THEME: Record<PopFeedTheme, string> = {
  report: "Il y a encore un point de friction ici.",
  suggestion: "Ce serait bien qu'il y ait une petite amélioration ici.",
  coupDeCoeur: "J'aime vraiment ce détail.",
};

const resolveBrandMessage = (
  message: PlanetPopFeedBrandMessage | undefined,
  fallback: string,
) => {
  if (!message) {
    return fallback;
  }

  return typeof message === "string" ? message : pickRandomValue(message);
};

export const buildPopFeedBrandMessage = (
  brand: PlanetPopFeedBrandConfig,
  theme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  if (theme === "report" && options?.linked) {
    return resolveBrandMessage(
      brand.copy.reportLinked ?? brand.copy.report,
      FALLBACK_MESSAGE_BY_THEME.report,
    );
  }

  return resolveBrandMessage(
    brand.copy[theme],
    FALLBACK_MESSAGE_BY_THEME[theme],
  );
};
