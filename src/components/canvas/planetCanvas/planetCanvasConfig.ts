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

export const PLANET_CANVAS_TRAIL_IMAGES = Array.from(
  { length: 13 },
  (_, index) => `/assets/images/about/imageAbout${index + 1}.png`,
);

export const POP_FEED_LIFETIME_MS = 5000;
export const POP_FEED_MAX_ATTEMPTS = 12;

export const POP_FEED_BRANDS_BY_THEME: Record<
  PopFeedTheme,
  readonly PlanetPopFeedBrandConfig[]
> = {
  suggestion: [
    {
      id: "sncf",
      label: "SNCF",
      image: "/assets/brandLogo/sncf.png",
      copy: {
        suggestion: "J’aimerais être informé en temps réel des retards.",
      },
    },
    {
      id: "amazon",
      label: "Amazon",
      image: "/assets/brandLogo/amazon.png",
      copy: {
        suggestion: "J’aurais aimé choisir le jour précis de la livraison",
      },
    },
    {
      id: "ubereats",
      label: "UberEats",
      image: "/assets/brandLogo/uberEats.png",
      copy: {
        suggestion:
          "J’aimerais une estimation plus précise du temps de livraison...",
      },
    },
  ],
  report: [
    {
      id: "instagram",
      label: "Instagram",
      image: "/assets/brandLogo/instagram.png",
      copy: {
        report: "Je ne peux plus recevoir mes messages...",
        reportLinked: "Je ne peux plus recevoir mes messages...",
      },
    },
    {
      id: "vinted",
      label: "Vinted",
      image: "/assets/brandLogo/vinted.png",
      copy: {
        report: "Colis marqué livré mais non reçu",
        reportLinked: "Colis marqué livré mais non reçu",
      },
    },
    {
      id: "canalplus",
      label: "Canal+",
      image: "/assets/brandLogo/canal.png",
      copy: {
        report: "Impossible de finaliser mon abonnement Canal+",
        reportLinked: "Impossible de finaliser mon abonnement Canal+",
      },
    },
  ],
  coupDeCoeur: [
    {
      id: "spotify",
      label: "Spotify",
      image: "/assets/brandLogo/spotify.png",
      copy: {
        coupDeCoeur:
          "J’adore les playlists personnalisées, elles sont vraiment bien faites.",
      },
    },
    {
      id: "revolut",
      label: "Revolut",
      image: "/assets/brandLogo/revolut.png",
      copy: {
        coupDeCoeur: "Application claire et facile à utiliser.",
      },
    },
    {
      id: "toogoodtogo",
      label: "Too Good To Go",
      image: "/assets/brandLogo/toogoodtogo.png",
      copy: {
        coupDeCoeur:
          "Trop bien de faire des économies et éviter le gaspillage.",
      },
    },
  ],
};

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
