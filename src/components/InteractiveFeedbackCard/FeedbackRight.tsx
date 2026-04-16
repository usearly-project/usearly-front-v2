import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "../shared/Avatar";
import FeedbackProgressBar from "./FeedbackProgressBar";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import UserBrandLine from "../shared/UserBrandLine";
import cdcIcon from "/assets/icons/cdc-icon.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";

interface Props {
  item: any;
  isMobile?: boolean;
  renderMobileVisual?: React.ReactNode;
  onToggle?: (id: string) => void;
  userProfile: any;
  selectedImage: string | null;
  setSelectedImage: (value: string | null) => void;
  isExpired: boolean;
  votes: number; // 🟢 C'est cette valeur qui change lors du vote
  max: number;
  barRef: React.RefObject<HTMLDivElement | null>;
  thumbLeft: number;
  expiresInDays: number | null;
  starProgressBar: string;
  onVoteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentCount: number;
  isGuest: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  showHeaderTypeIcon?: boolean;
}

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const FeedbackRight: React.FC<Props> = ({
  item,
  isMobile = false,
  renderMobileVisual,
  userProfile,
  setSelectedImage,
  isExpired,
  votes, // 🟢 Valeur réactive reçue du parent
  max,
  barRef,
  thumbLeft,
  expiresInDays,
  starProgressBar,
  onVoteClick,
  showComments,
  onToggleComments,
  commentCount,
  isGuest,
  onExpandedChange,
  showHeaderTypeIcon = false,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const previousHeightRef = useRef<number | null>(null);
  const animationCleanupRef = useRef<(() => void) | null>(null);
  const safeUserId = userProfile?.id;
  const DESCRIPTION_LIMIT = 100;
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;
  const brandName = item.marque?.trim() ?? "";

  const headerTypeIcon =
    item.type === "coupdecoeur"
      ? cdcIcon
      : item.type === "suggestion"
        ? suggestIcon
        : null;
  const siteUrl = item?.siteUrl ?? undefined;

  const toggleText = () => {
    if (animationCleanupRef.current) animationCleanupRef.current();
    previousHeightRef.current = cardRef.current
      ? cardRef.current.offsetHeight
      : null;
    setShowFullText((prev) => !prev);
  };

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    return () => {
      if (animationCleanupRef.current) animationCleanupRef.current();
    };
  }, []);

  useLayoutEffect(() => {
    const element = cardRef.current;
    const startHeight = previousHeightRef.current;
    if (!element || startHeight === null) return;
    const endHeight = element.offsetHeight;
    if (startHeight === endHeight) {
      previousHeightRef.current = null;
      animationCleanupRef.current = null;
      return;
    }
    element.classList.add("is-resizing");
    element.style.height = `${startHeight}px`;
    element.style.transition = "none";
    const rafId = window.requestAnimationFrame(() => {
      element.style.transition = "height 320ms cubic-bezier(0.4, 0, 0.2, 1)";
      element.style.height = `${endHeight}px`;
    });
    const finishAnimation = () => {
      element.classList.remove("is-resizing");
      element.style.removeProperty("height");
      element.style.removeProperty("transition");
      previousHeightRef.current = null;
      animationCleanupRef.current = null;
    };
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "height") return;
      element.removeEventListener("transitionend", handleTransitionEnd);
      window.cancelAnimationFrame(rafId);
      finishAnimation();
    };
    element.addEventListener("transitionend", handleTransitionEnd);
    animationCleanupRef.current = () => {
      element.removeEventListener("transitionend", handleTransitionEnd);
      window.cancelAnimationFrame(rafId);
      finishAnimation();
    };
  }, [showFullText]);

  useEffect(() => {
    onExpandedChange?.(showFullText);
  }, [showFullText, onExpandedChange]);

  return (
    <div
      ref={cardRef}
      className={`feedback-right${showFullText ? " is-expanded" : ""}${isMobile ? " is-mobile-version" : ""}`}
    >
      <div className="feedback-content">
        <div className="feedback-header">
          <div className="feedback-header-main">
            {showHeaderTypeIcon && headerTypeIcon && (
              <span
                className={`feedback-header-type-icon feedback-header-type-icon--${item.type}`}
                aria-hidden="true"
              >
                <img src={headerTypeIcon} alt="" />
              </span>
            )}
            <div className="feedback-meta">
              <UserBrandLine
                userId={item.author?.id}
                pseudo={item.author?.pseudo}
                email={item.author?.email}
                brand={item.marque}
                type={item.type}
              />
              ⸱
              {isValidDate(item.createdAt) && (
                <span className="feedback-date">
                  {formatDistanceToNowStrict(new Date(item.createdAt), {
                    locale: fr,
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="avatar-with-brand">
            <div className="user-avatar-wrapper">
              <Avatar
                avatar={item.author?.avatar}
                pseudo={item.author?.pseudo || "Utilisateur"}
                type="user"
                wrapperClassName="user-avatar"
                sizeHW={isMobile ? 32 : 50}
              />
              {brandName && (
                <div className="brand-overlay">
                  <Avatar
                    avatar={null}
                    pseudo={brandName}
                    type="brand"
                    siteUrl={siteUrl}
                    wrapperClassName="brand-logo"
                    sizeHW={isMobile ? 32 : 50}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobile && renderMobileVisual && (
          <div className="feedback-mobile-visual-container">
            {renderMobileVisual}
          </div>
        )}

        <div className="feedback-body">
          <p
            className={`feedback-body-text ${showFullText ? " is-expanded" : ""}`}
          >
            {showFullText
              ? description
              : description.length > DESCRIPTION_LIMIT
                ? `${description.slice(0, DESCRIPTION_LIMIT)}…`
                : description}
            {item.capture && showFullText && (
              <div className="capture-wrapper">
                <img
                  src={item.capture}
                  alt="capture"
                  className="capture"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(item.capture!);
                  }}
                />
              </div>
            )}
            {shouldShowToggle && (
              <button
                className="see-more"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleText();
                }}
                aria-label={showFullText ? "Voir moins" : "Voir plus"}
              >
                {showFullText ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* 🟢 BARRE DE PROGRESSION : On utilise bien 'votes' qui vient des props */}
      {item.type === "suggestion" && (
        <FeedbackProgressBar
          votes={votes} // IMPORTANT : Utilise la prop 'votes', pas 'item.votes'
          max={max}
          expiresInDays={expiresInDays}
          barRef={barRef}
          thumbLeft={thumbLeft}
          isExpired={isExpired}
          starProgressBar={starProgressBar}
        />
      )}

      <div
        className="feedback-shared-footer"
        onClick={(e) => e.stopPropagation()}
      >
        <SharedFooterCdcAndSuggest
          userId={safeUserId}
          descriptionId={item.id}
          type={item.type}
          onVoteClick={item.type === "suggestion" ? onVoteClick : undefined}
          isExpired={isExpired}
          commentCount={commentCount}
          showComments={showComments}
          onToggleComments={onToggleComments}
          isGuest={isGuest}
          // Si SharedFooterCdcAndSuggest affiche aussi le nombre de votes, passe lui 'votes' ici
        />
      </div>
    </div>
  );
};

export default FeedbackRight;
