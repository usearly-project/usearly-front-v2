import type { ReactNode } from "react";
import PlanetCanvas from "@src/components/canvas/PlanetCanvas";
import type { PopFeedVariant } from "@src/components/canvas/planetCanvas/types";
import SquareRoundButton from "@src/components/buttons/SquareRoundButton";
import { APP_DOWNLOAD_STORE_LINKS } from "@src/components/app-download/appDownload.constants";
import "./MobileSectionhookUsers.scss";

type MobileSectionHookUsersProps = {
  title: ReactNode;
  subtitle: ReactNode;
  extensionLabel: string;
  communityLabel: string;
  extensionIconSrc: string;
  extensionIconAlt: string;
  onCommunityClick: () => void;
  onExtensionClick: () => void;
  onExtensionHelpClick: () => void;
  popFeedVariant?: PopFeedVariant;
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

const MobileSectionHookUsers = ({
  title,
  subtitle,
  extensionLabel,
  communityLabel,
  extensionIconSrc,
  extensionIconAlt,
  onCommunityClick,
  onExtensionClick,
  onExtensionHelpClick,
  popFeedVariant = "default",
}: MobileSectionHookUsersProps) => {
  return (
    <section className="mobile-sectionhook-users">
      <div className="mobile-sectionhook-users__visual">
        <PlanetCanvas
          width="min(100%, 520px)"
          height="clamp(385px, 58vw, 460px)"
          className="mobile-sectionhook-users__canvas"
          popFeed
          popFeedVariant={popFeedVariant}
        />
      </div>

      <div className="mobile-sectionhook-users__content">
        <div className="mobile-sectionhook-users__header">
          <h2 className="mobile-sectionhook-users__title">{title}</h2>
          <p className="mobile-sectionhook-users__subtitle">{subtitle}</p>
        </div>

        <div className="mobile-sectionhook-users__actions">
          <SquareRoundButton
            text={communityLabel}
            classNames={"mobile-sectionhook-users__community-button"}
            onClick={onCommunityClick}
          />

          <div className="mobile-sectionhook-users__install">
            <div className="mobile-sectionhook-users__install-extension">
              <button
                type="button"
                className="mobile-sectionhook-users__extension-button"
                aria-label={extensionLabel}
                onClick={onExtensionClick}
              >
                <img
                  src={extensionIconSrc}
                  width={40}
                  height={40}
                  alt={extensionIconAlt}
                />
                <span>{extensionLabel}</span>
              </button>

              <button
                type="button"
                className="mobile-sectionhook-users__extension-help"
                aria-label="Comment installer l’extension en 2 minutes ?"
                onClick={onExtensionHelpClick}
              >
                Comment installer l’extension ?
              </button>
            </div>

            <div className="mobile-sectionhook-users__store-links">
              {APP_DOWNLOAD_STORE_LINKS.map((storeLink) => (
                <a
                  key={storeLink.label}
                  href={storeLink.href}
                  className="mobile-sectionhook-users__store-link"
                  aria-label={storeLink.ariaLabel}
                  data-mobile-navigation-allow="true"
                  {...getExternalLinkProps(storeLink.href)}
                >
                  <img src={storeLink.badgeSrc} alt={storeLink.badgeAlt} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileSectionHookUsers;
