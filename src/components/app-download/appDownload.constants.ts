export const APP_DOWNLOAD_SECTION_ID = "telecharger-application";
export const APP_DOWNLOAD_ROUTE = `/home#${APP_DOWNLOAD_SECTION_ID}`;

// TODO: remplacer par l'URL publique de l'application Usearly sur l'App Store.
export const APP_STORE_URL = "#";

// TODO: remplacer par l'URL publique de l'application Usearly sur Google Play.
export const GOOGLE_PLAY_URL = "#";

// TODO: remplacer par un smart link mobile quand les stores seront disponibles.
export const MOBILE_APP_DOWNLOAD_URL = "#";

// TODO: remplacer par le vrai QR code de téléchargement une fois le smart link finalisé.
export const APP_DOWNLOAD_QR_CODE_SRC =
  "/assets/images/app-download-qr-placeholder.svg";

export const APP_STORE_BADGE_SRC = "/assets/images/appleDownload.svg";
export const GOOGLE_PLAY_BADGE_SRC = "/assets/images/googleDownload.svg";

export const APP_DOWNLOAD_STORE_LINKS = [
  {
    label: "App Store",
    href: APP_STORE_URL,
    badgeSrc: APP_STORE_BADGE_SRC,
    badgeAlt: "Télécharger Usearly dans l'App Store",
    ariaLabel: "Télécharger Usearly dans l'App Store",
  },
  {
    label: "Google Play",
    href: GOOGLE_PLAY_URL,
    badgeSrc: GOOGLE_PLAY_BADGE_SRC,
    badgeAlt: "Télécharger Usearly sur Google Play",
    ariaLabel: "Télécharger Usearly sur Google Play",
  },
] as const;
