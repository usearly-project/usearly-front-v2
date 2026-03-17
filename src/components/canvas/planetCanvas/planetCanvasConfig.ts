import reportIcon from "/assets/icons/reportYellowIcon.svg";
import heartIcon from "/assets/icons/cdc-icon.svg";
import suggestionIcon from "/assets/icons/suggest-icon.svg";
import type { PlanetPopFeedThemeConfig, PopFeedTheme } from "./types";

export const PLANET_CANVAS_TRAIL_IMAGES = Array.from(
  { length: 13 },
  (_, index) => `/assets/images/about/imageAbout${index + 1}.png`,
);

export const POP_FEED_LIFETIME_MS = 5000;
export const POP_FEED_MAX_ATTEMPTS = 12;

export const POP_FEED_BRAND_LOGOS = [
  "/assets/brandLogo/nike.png",
  "/assets/brandLogo/bourso.png",
  "/assets/brandLogo/airbnd.png",
  "/assets/brandLogo/lbo.png",
  "/assets/brandLogo/duo.png",
  "/assets/brandLogo/instagram.png",
  "/assets/brandLogo/uberEats.png",
  "/assets/brandLogo/spotify.png",
  "/assets/brandLogo/netflix.png",
] as const;

export const POP_FEED_THEME_CONFIG: Record<
  PopFeedTheme,
  PlanetPopFeedThemeConfig
> = {
  report: {
    icon: reportIcon,
    surface: "#4E8CFF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
    messages: [
      "J'ai aussi eu ce problème.",
      "Ce bug m'a bloqué aussi.",
      "Même friction de mon côté.",
    ],
    linkedMessages: [
      "Même souci ici.",
      "Encore un cas similaire.",
      "On est plusieurs à le voir.",
    ],
  },
  suggestion: {
    icon: suggestionIcon,
    surface: "#37D48B",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
    messages: [
      "Un raccourci ici serait top.",
      "Une vue compacte aiderait vraiment.",
      "Un filtre ici aiderait.",
    ],
  },
  coupDeCoeur: {
    icon: heartIcon,
    surface: "#A688FF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
    messages: [
      "Le design ici est ultra propre.",
      "Cette interaction est top",
      "Ce détail donne envie de revenir.",
    ],
  },
};
