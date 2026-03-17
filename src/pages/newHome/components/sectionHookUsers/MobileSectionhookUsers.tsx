import type { ReactNode } from "react";
import PlanetCanvas from "@src/components/canvas/PlanetCanvas";
import SquareRoundButton from "@src/components/buttons/SquareRoundButton";
import "./MobileSectionhookUsers.scss";

type MobileSectionHookUsersProps = {
  title: ReactNode;
  subtitle: ReactNode;
  extensionLabel: string;
  communityLabel: string;
  extensionIconSrc: string;
  extensionIconAlt: string;
};

const MobileSectionHookUsers = ({
  title,
  subtitle,
  extensionLabel,
  communityLabel,
  extensionIconSrc,
  extensionIconAlt,
}: MobileSectionHookUsersProps) => {
  return (
    <section className="mobile-sectionhook-users">
      <div className="mobile-sectionhook-users__visual">
        <PlanetCanvas
          width="min(100%, 520px)"
          height="clamp(385px, 58vw, 460px)"
          className="mobile-sectionhook-users__canvas"
          popFeed
        />
      </div>

      <div className="mobile-sectionhook-users__content">
        <div className="mobile-sectionhook-users__header">
          <h2 className="mobile-sectionhook-users__title">{title}</h2>
          <p className="mobile-sectionhook-users__subtitle">{subtitle}</p>
        </div>

        <div className="mobile-sectionhook-users__actions">
          <button className="mobile-sectionhook-users__extension-button">
            <img
              src={extensionIconSrc}
              width={40}
              height={40}
              alt={extensionIconAlt}
            />
            <span>{extensionLabel}</span>
          </button>

          <SquareRoundButton
            text={communityLabel}
            classNames={"mobile-sectionhook-users__community-button"}
          />
        </div>
      </div>
    </section>
  );
};

export default MobileSectionHookUsers;
