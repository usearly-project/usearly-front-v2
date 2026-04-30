import "./AppDownloadRow.scss";
import {
  APP_DOWNLOAD_SECTION_ID,
  APP_DOWNLOAD_STORE_LINKS,
} from "./appDownload.constants";

const getExternalLinkProps = (href: string) => {
  if (!href.startsWith("http")) {
    return {};
  }

  return {
    target: "_blank",
    rel: "noopener noreferrer",
  };
};

const AppDownloadRow = () => {
  return (
    <section
      className="app-download-row"
      id={APP_DOWNLOAD_SECTION_ID}
      aria-label="Télécharger l'application Usearly"
    >
      <div className="app-download-row__store-links">
        {APP_DOWNLOAD_STORE_LINKS.map((storeLink) => (
          <a
            key={storeLink.label}
            href={storeLink.href}
            className="app-download-row__store-link"
            aria-label={storeLink.ariaLabel}
            {...getExternalLinkProps(storeLink.href)}
          >
            <img src={storeLink.badgeSrc} alt={storeLink.badgeAlt} />
          </a>
        ))}
      </div>

      <div className="app-download-row__copy">
        <p className="app-download-row__headline">
          Télécharge l&apos;appli et connecte-toi aux marques dès maintenant !
        </p>
        <p className="app-download-row__subtext">
          Avec Usearly, ta voix a un vrai impact.
        </p>
      </div>
    </section>
  );
};

export default AppDownloadRow;
