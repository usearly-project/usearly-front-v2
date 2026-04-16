import Modal from "@src/components/ui/Modal";
import {
  APP_DOWNLOAD_STORE_LINKS,
  MOBILE_APP_DOWNLOAD_URL,
} from "./appDownload.constants";
import "./AppDownloadModal.scss";

type AppDownloadModalProps = {
  onClose: () => void;
};

const getExternalLinkProps = (href: string) => {
  if (!href.startsWith("http")) {
    return {};
  }

  return {
    target: "_blank",
    rel: "noopener noreferrer",
  };
};

const AppDownloadModal = ({ onClose }: AppDownloadModalProps) => {
  return (
    <Modal
      onClose={onClose}
      overlayClassName="app-download-modal-overlay"
      contentClassName="app-download-modal"
    >
      <button
        type="button"
        className="app-download-modal__close"
        onClick={onClose}
        aria-label="Fermer"
      >
        x
      </button>

      <span className="app-download-modal__eyebrow">Application mobile</span>
      <h2 className="app-download-modal__title">
        Continuez sur l'application Usearly
      </h2>
      <p className="app-download-modal__text">
        Sur mobile, retrouvez vos actus, feedbacks et rapports directement dans
        l'app.
      </p>

      <div className="app-download-modal__stores">
        {APP_DOWNLOAD_STORE_LINKS.map((storeLink) => (
          <a
            key={storeLink.label}
            href={storeLink.href}
            className="app-download-modal__store-link"
            aria-label={storeLink.ariaLabel}
            data-mobile-navigation-allow="true"
            {...getExternalLinkProps(storeLink.href)}
          >
            <img src={storeLink.badgeSrc} alt={storeLink.badgeAlt} />
          </a>
        ))}
      </div>

      <a
        href={MOBILE_APP_DOWNLOAD_URL}
        className="app-download-modal__primary-link"
        aria-label="Télécharger l'application Usearly"
        data-mobile-navigation-allow="true"
        {...getExternalLinkProps(MOBILE_APP_DOWNLOAD_URL)}
      >
        Télécharger l'application
      </a>
    </Modal>
  );
};

export default AppDownloadModal;
