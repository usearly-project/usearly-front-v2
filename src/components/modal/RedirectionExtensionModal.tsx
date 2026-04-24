import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./RedirectionExtensionModal.scss";
import signalIcon from "/assets/icons/signal-icon.svg";
import cdcIcon from "/assets/icons/cdc-icon-white.svg";
import suggestIcon from "/assets/icons/suggest-icon-white.svg";
import logoExtension from "/assets/icons/logo-extension.svg";
import chromeLogo from "/assets/logo/chrome.svg";
import ExtensionRedirect from "../extension-redirect/ExtensionRedirect";
import Modal from "../ui/Modal";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface RedirectionExtensionModalProps {
  onClose: () => void;
  brandName?: string;
  url?: string;
}

const RedirectionExtensionModal: React.FC<RedirectionExtensionModalProps> = ({
  onClose,
  brandName,
  url,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  const handleGoClick = () => {
    if (url) {
      // 🟢 Vérifie si l'url commence par http ou https
      // Sinon, on ajoute https:// devant pour éviter que le navigateur reste sur localhost
      const finalUrl = url.startsWith("http") ? url : `https://${url}`;

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  const handleInstallExtension = () => {
    window.open(
      "https://chromewebstore.google.com/detail/usearly-%E2%80%93-extension-assis/geclfkocbehpdojggpaeeofgdiiajcii",
      "_blank",
    );
  };

  // 🟢 LOGIQUE DE BASCULE : Si on veut voir le tuto, on rend la Modal de redirection
  if (isExtensionModalOpen) {
    return (
      <Modal
        onClose={() => setIsExtensionModalOpen(false)}
        overlayClassName="extension-redirect-modal-overlay"
        contentClassName="extension-redirect-modal-content"
      >
        <ExtensionRedirect
          isModal
          onClose={() => setIsExtensionModalOpen(false)}
        />
      </Modal>
    );
  }

  // 🔵 SINON : On rend la modal de redirection classique
  return createPortal(
    <div className="usearly-modal-overlay" onClick={onClose}>
      <div
        className="usearly-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-x" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <div className="modal-header">
          <div className="warning-icon-wrapper">
            <img src={signalIcon} alt="Alert" />
          </div>
          <h2>Vérifie et signale le problème en direct</h2>
          <p className="modal-desc">
            Tu vas être redirigé vers{" "}
            <strong>{brandName || "la marque"}</strong> pour reproduire le
            problème.
            <br />
            <span className="highlight">
              👉 Une fois sur place, utilise l'extension Usearly pour le
              signaler en 2 clics.
            </span>
          </p>
        </div>

        <div className="modal-actions-row">
          <Button
            className="btn-go"
            variant={"secondary"}
            onClick={handleGoClick}
            aria-label="J'y vais"
          >
            J'y vais
          </Button>
          {/* <button
            className="btn-go"
            onClick={handleGoClick}
            aria-label="J'y vais"
          >
            J'y vais
          </button> */}
          <Button
            className="btn-cancel"
            variant={"secondary"}
            onClick={onClose}
            aria-label="Annuler"
          >
            Annuler
          </Button>
        </div>

        <div className="browser-mockup-container">
          <div className="browser-chrome-bar">
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="url-bar">
              <span className="lock">🔒</span> {url ? `${url}` : "site-web.com"}
            </div>
            <div className="extension-icons-chrome">
              <img src={logoExtension} alt="U" className="logo-ext-small" />
            </div>
          </div>

          <div className="browser-content">
            <div className="content-left-dark">
              <button
                className="chrome-install-btn"
                onClick={handleInstallExtension}
                aria-label="Installer l'extension"
              >
                <img src={chromeLogo} alt="Chrome" />
                Installer l'extension
              </button>
              <p
                className="help-text"
                onClick={() => setIsExtensionModalOpen(true)}
              >
                Comment installer l'extension en 3 clics ?
              </p>
            </div>

            <div className="content-right-white">
              <button
                className="widget-close-small"
                aria-label="Fermer le widget Usearly"
              >
                ✕
              </button>
              <div className="widget-inner">
                <h3>
                  <span className="widget-inner-text-bubble">10 problèmes</span>{" "}
                  signalés sur ce site
                </h3>
                <div className="search-bar-sim">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher un problème"
                    readOnly
                  />
                  <span className="search-icon-sim">
                    <Search width={16} height={16} />
                  </span>
                </div>
              </div>

              <div className="usearly-sidebar-exact">
                <div className="side-item side-logo-u">
                  <img src={logoExtension} alt="Logo Usearly" />
                </div>
                <div className="side-item side-warning">
                  <img src={signalIcon} alt="Signal" />
                </div>
                <div className="side-item">
                  <img src={cdcIcon} alt="Coup de coeur" />
                </div>
                <div className="side-item">
                  <img src={suggestIcon} alt="Suggestion" />
                </div>
                <div className="side-dots-container">
                  <span className="side-dots">...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RedirectionExtensionModal;
