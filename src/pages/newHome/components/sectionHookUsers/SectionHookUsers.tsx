import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanetCanvas from "@src/components/canvas/PlanetCanvas";
import type { PopFeedVariant } from "@src/components/canvas/planetCanvas/types";
import { useIsMobile } from "@src/hooks/use-mobile";
import "./SectionHookUsers.scss";
import SquareRoundButton from "@src/components/buttons/SquareRoundButton";
import Modal from "@src/components/ui/Modal";
import ExtensionRedirect from "@src/components/extension-redirect/ExtensionRedirect";
import MobileSectionHookUsers from "./MobileSectionhookUsers";
import chromeLogo from "/assets/logo/chrome.svg";
import appStore from "/assets/logo/apple-appstore.svg";
import googlePlay from "/assets/logo/google-googleplay.svg";

const SECTION_HOOK_USERS_TITLE = (
  <>
    Améliorer l'experience utilisateur sur tous les sites{"\u00A0"}
    et apps !
  </>
);

const SECTION_HOOK_USERS_SUBTITLE = (
  <>
    Installez dès maintenant l’extension et commencer à signaler les irritants,
    suggérer des idées et exprimez vos coups de coeur. <br />
    Ensemble, on fait bouger les marques !
  </>
);

const EXTENSION_BUTTON_LABEL = "Installer l'extension";
const COMMUNITY_BUTTON_LABEL = "Rejoindre la communauté";

type SectionHookUsersProps = {
  popFeedVariant?: PopFeedVariant;
};

type DesktopSectionHookUsersProps = {
  popFeedVariant: PopFeedVariant;
  onCommunityClick: () => void;
  onInstallExtension: () => void;
  onOpenExtensionModal: () => void;
};

const DesktopSectionHookUsers = ({
  popFeedVariant,
  onCommunityClick,
  onInstallExtension,
  onOpenExtensionModal,
}: DesktopSectionHookUsersProps) => {
  return (
    <section className="section-hook-users">
      <div className="hook-users-content">
        <div className="hook-users-content-text">
          <h2 className="hook-users-title">{SECTION_HOOK_USERS_TITLE}</h2>
          <p className="hook-users-subtitle">{SECTION_HOOK_USERS_SUBTITLE}</p>
        </div>
        <div className="hook-users-content-buttons">
          <div className="hook-users-content-buttons-community">
            <SquareRoundButton
              text={COMMUNITY_BUTTON_LABEL}
              classNames={"button-rejoindre"}
              onClick={onCommunityClick}
            />
          </div>
          <div className="hook-users-content-buttons-install">
            <div className="hook-users-content-buttons-install-buttons extension">
              <button
                type="button"
                className="hook-users-extension-button"
                onClick={onInstallExtension}
                aria-label={EXTENSION_BUTTON_LABEL}
              >
                <img src={chromeLogo} width={38} height={38} alt="Chrome" />
                {EXTENSION_BUTTON_LABEL}
              </button>
              <button
                type="button"
                onClick={onOpenExtensionModal}
                aria-label="Comment installer l’extension en 2 minutes ?"
                className="hook-users-extension-button-description"
              >
                Comment installer l’extension ?
              </button>
            </div>
            <div className="hook-users-content-buttons-install-buttons apple">
              {/* Remplacer par URL APPSTORE */}
              <a
                href=""
                aria-label="Télécharger sur l'App Store"
                target="_blank"
              >
                <img src={appStore} alt="" />
              </a>
            </div>
            <div className="hook-users-content-buttons-install-buttons google">
              {/* Remplacer par URL GOOGLEPLAY */}
              <a
                href=""
                aria-label="Télécharger sur Google Play"
                target="_blank"
              >
                <img src={googlePlay} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <PlanetCanvas
        width={1500}
        height="92vh"
        popFeed
        popFeedVariant={popFeedVariant}
      />
    </section>
  );
};

const SectionHookUsers = ({
  popFeedVariant = "default",
}: SectionHookUsersProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile("(max-width: 1250px)");
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const handleJoinCommunity = () => navigate("/lookup");
  const handleInstallExtension = () => {
    window.open(
      "https://chromewebstore.google.com/search/Usearly%20%E2%80%93%20Extension%20Assistant?hl=fr&utm_source=ext_sidebar",
      "_blank",
    );
  };
  const handleOpenExtensionModal = () => setIsExtensionModalOpen(true);
  const sectionContent = isMobile ? (
    <MobileSectionHookUsers
      title={SECTION_HOOK_USERS_TITLE}
      subtitle={SECTION_HOOK_USERS_SUBTITLE}
      extensionLabel={EXTENSION_BUTTON_LABEL}
      communityLabel={COMMUNITY_BUTTON_LABEL}
      extensionIconSrc={chromeLogo}
      extensionIconAlt="Chrome"
      onCommunityClick={handleJoinCommunity}
      onExtensionClick={handleInstallExtension}
      onExtensionHelpClick={handleOpenExtensionModal}
      popFeedVariant={popFeedVariant}
    />
  ) : (
    <DesktopSectionHookUsers
      popFeedVariant={popFeedVariant}
      onCommunityClick={handleJoinCommunity}
      onInstallExtension={handleInstallExtension}
      onOpenExtensionModal={handleOpenExtensionModal}
    />
  );

  return (
    <>
      {sectionContent}

      {isExtensionModalOpen ? (
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
      ) : null}
    </>
  );
};

export default SectionHookUsers;
