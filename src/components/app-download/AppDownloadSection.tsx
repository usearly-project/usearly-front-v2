import "./AppDownloadSection.scss";
import {
  APP_DOWNLOAD_QR_CODE_SRC,
  APP_DOWNLOAD_SECTION_ID,
  APP_DOWNLOAD_STORE_LINKS,
  MOBILE_APP_DOWNLOAD_URL,
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

const AppDownloadSection = () => {
  return (
    <section
      className="app-download-section"
      id={APP_DOWNLOAD_SECTION_ID}
      aria-labelledby="app-download-title"
    >
      <div className="app-download-section__content">
        <span className="app-download-section__eyebrow">
          Application mobile
        </span>
        <h2 className="app-download-section__title" id="app-download-title">
          Téléchargez Usearly
        </h2>
        <p className="app-download-section__text">
          Accédez à vos actus, feedbacks et rapports directement depuis votre
          téléphone.
        </p>

        <div className="app-download-section__store-links">
          {APP_DOWNLOAD_STORE_LINKS.map((storeLink) => (
            <a
              key={storeLink.label}
              href={storeLink.href}
              className="app-download-section__store-link"
              aria-label={storeLink.ariaLabel}
              {...getExternalLinkProps(storeLink.href)}
            >
              <img src={storeLink.badgeSrc} alt={storeLink.badgeAlt} />
            </a>
          ))}
        </div>

        <a
          href={MOBILE_APP_DOWNLOAD_URL}
          className="app-download-section__mobile-button"
          aria-label="Télécharger l'application Usearly"
          {...getExternalLinkProps(MOBILE_APP_DOWNLOAD_URL)}
        >
          Télécharger l'application
        </a>
      </div>

      <div className="app-download-section__qr" aria-hidden="false">
        <img
          src={APP_DOWNLOAD_QR_CODE_SRC}
          alt="QR code temporaire pour télécharger l'application Usearly"
        />
        <p>Scannez pour télécharger</p>
      </div>
    </section>
  );
};

export default AppDownloadSection;
