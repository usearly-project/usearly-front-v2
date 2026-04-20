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

export const POP_FEED_LIFETIME_MS = 10000;
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

const POP_FEED_THEME_KEYS: readonly PopFeedTheme[] = [
  "report",
  "suggestion",
  "coupDeCoeur",
];

// Ancien fallback désactivé : Pop Feed doit afficher uniquement les textes configurés.
// const FALLBACK_MESSAGE_BY_THEME: Record<PopFeedTheme, string> = {
//   report: "Il y a encore un point de friction ici.",
//   suggestion: "Ce serait bien qu'il y ait une petite amélioration ici.",
//   coupDeCoeur: "J'aime vraiment ce détail.",
// };

const hasBrandMessage = (message: PlanetPopFeedBrandMessage | undefined) => {
  if (!message) {
    return false;
  }

  return typeof message === "string"
    ? message.trim().length > 0
    : message.length > 0;
};

const getBrandMessageForTheme = (
  brand: PlanetPopFeedBrandConfig,
  theme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  if (options?.linked && theme !== "report") {
    return undefined;
  }

  if (theme === "report" && options?.linked) {
    return brand.copy.reportLinked ?? brand.copy.report;
  }

  return brand.copy[theme];
};

const resolveBrandMessage = (
  message: PlanetPopFeedBrandMessage | undefined,
) => {
  if (!message) {
    return undefined;
  }

  if (typeof message === "string") {
    return message.trim().length > 0 ? message : undefined;
  }

  if (!message.length) {
    return undefined;
  }

  return pickRandomValue(message);
};

export const getAvailablePopFeedThemes = (
  brand: PlanetPopFeedBrandConfig,
  options?: {
    linked?: boolean;
  },
) =>
  POP_FEED_THEME_KEYS.filter((theme) =>
    hasBrandMessage(getBrandMessageForTheme(brand, theme, options)),
  );

export const resolvePopFeedBrandTheme = (
  brand: PlanetPopFeedBrandConfig,
  preferredTheme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  if (
    hasBrandMessage(getBrandMessageForTheme(brand, preferredTheme, options))
  ) {
    return preferredTheme;
  }

  const availableThemes = getAvailablePopFeedThemes(brand, options);

  if (!availableThemes.length) {
    return undefined;
  }

  return pickRandomValue(availableThemes);
};

export const buildPopFeedBrandMessage = (
  brand: PlanetPopFeedBrandConfig,
  theme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  return resolveBrandMessage(getBrandMessageForTheme(brand, theme, options));
};

export const resolvePopFeedBrandContent = (
  brand: PlanetPopFeedBrandConfig,
  preferredTheme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  const theme = resolvePopFeedBrandTheme(brand, preferredTheme, options);

  if (!theme) {
    return undefined;
  }

  const message = buildPopFeedBrandMessage(brand, theme, options);

  if (!message) {
    return undefined;
  }

  return { theme, message };
};
