import React, { useRef, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
// import { Hand } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { TICKET_STATUSES, type TicketStatusKey } from "@src/types/ticketStatus";
import type { HasBrandResponse } from "@src/types/brandResponse";
import ReportAvatars from "@src/pages/public/components/ReportAvatar/ReportsAvatar";
import type { User } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import lightBulbLight from "/assets/icons/solution-icon-light.svg";
import lightBulbNoLight from "/assets/icons/solution-icon-light.svg";
import RedirectionExtensionModal from "../modal/RedirectionExtensionModal";
import simpleLeftHand from "/assets/icons/simple-left-hand.svg";
import { useIsMobile } from "@src/hooks/use-mobile";
import AuthTooltip from "@src/components/shared/AuthTooltip";
import { useAuthTooltip } from "@src/hooks/useAuthTooltip";

interface Props {
  type: "report" | "suggestion" | "coupDeCoeur";
  userId?: string;
  solutionsCount?: number;
  descriptionId: string;
  reportsCount: number;
  reportId?: string;
  brandResponse?: any;
  showBrandResponseInline?: boolean;
  hasBrandResponse?: HasBrandResponse;
  commentsCount: number;
  status: TicketStatusKey;
  brandLogoUrl?: string;
  brandName?: string; // Ajouté pour la modal
  siteUrl?: string; // Ajouté pour la modal
  reactions?: any[];
  onReactClick: () => void;
  onCommentClick: () => void;
  onToggleSimilarReports?: () => void;
  descriptions?: {
    author: {
      id: string;
      pseudo: string;
      avatar: string | null;
    } | null;
  }[];
  onOpenSolutionModal?: () => void;
  onOpenSolutionsList?: () => void;
  isMobile?: boolean;
}

const ReportActionsBarWithReactions: React.FC<Props> = ({
  descriptionId,
  reportsCount,
  commentsCount,
  status,
  solutionsCount = 0,
  onCommentClick,
  onToggleSimilarReports,
  descriptions,
  onOpenSolutionModal,
  brandName,
  siteUrl,
  isMobile: isMobileProp,
}) => {
  const { userProfile } = useAuth();
  const isAuthenticated = !!userProfile?.id;
  const detectedIsMobile = useIsMobile();
  const isMobile = isMobileProp ?? detectedIsMobile;
  // const is1350px = useIsMobile("(max-width: 1350px)");
  const is1200px = useIsMobile("(max-width: 1200px)");

  // 🟢 ÉTAT POUR LA MODAL D'EXTENSION
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  const { getCount, handleReact } = useReactionsForDescription(
    userProfile?.id ?? "",
    descriptionId,
  );

  const emojis = getEmojisForType("report");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const statusConfig = TICKET_STATUSES.find((s) => s.key === status);
  const { showAuthTooltip, tooltipText, tooltipPosition, triggerTooltip } =
    useAuthTooltip();
  const solutionTooltipLabel =
    solutionsCount > 0 ? "Solutions" : "Proposer une solution";

  if (!statusConfig) return null;

  // --- LOGIQUE DU CLIC SIGNALER ---
  const handleSignalerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      triggerTooltip("Connecte-toi pour signaler", event);
      return;
    }

    if (!isMobile) {
      setShowExtensionModal(true);
    } else {
      onToggleSimilarReports?.();
    }
  };

  const handleAddReaction = async (emoji: string) => {
    if (!isAuthenticated) {
      triggerTooltip("Connecte-toi pour réagir");
      return;
    }
    await handleReact(emoji);
    setShowEmojiPicker(false);
  };

  const reporters = (descriptions ?? [])
    .map((d) => d.author)
    .filter((u): u is User => !!u);

  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = allReactions.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className={`report-actions-bar${isMobile ? " is-mobile" : ""}`}>
      {/* ... (Reste du JSX des compteurs identique) ... */}
      <div className="counts-row">
        <div className="count-left">
          {topThree.length > 0 && (
            <div className="reactions-summary">
              {topThree.map((r) => (
                <span key={r.emoji} className="emoji-icon">
                  {r.emoji}
                </span>
              ))}
              <span className="reaction-count">{totalCount}</span>
            </div>
          )}
        </div>
        <div className="count-right">
          {commentsCount > 0 && (
            <span className="comments-link" onClick={onCommentClick}>
              {commentsCount} commentaires
            </span>
          )}
          <div className="signalements-avatars">
            {reporters.length > 0 && <ReportAvatars users={reporters} />}
            {reportsCount > 0 && (
              <span
                className="resignalements-link"
                onClick={onToggleSimilarReports}
              >
                <span className="resignalements-count">{reportsCount}</span>
                <span className="resignalements-label">
                  {(reportsCount ?? 0) > 1 ? "Signalements" : "Signalement"}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="separator" />

      <div className="actions-row">
        <div className="actions-left">
          {/* Bloc Réagir */}
          <div
            className="react-hover-area"
            onMouseEnter={() => {
              if (isAuthenticated) {
                // 🟢 Si un timer de fermeture est en cours, on l'annule
                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                setShowEmojiPicker(true);
              }
            }}
            onMouseLeave={() => {
              // 🟢 On stocke le timeout dans .current
              hoverTimeout.current = setTimeout(() => {
                setShowEmojiPicker(false);
              }, 250);
            }}
          >
            <button
              onClick={(event) =>
                !isAuthenticated &&
                triggerTooltip("Connecte-toi pour réagir", event)
              }
              aria-label="Réagir"
            >
              <ThumbsUp size={isMobile ? 18 : 22} />
              {/* {is1350px ? null : (
                <span className="reagir-span-btn">Réagir</span>
              )} */}
            </button>
            {showEmojiPicker && isAuthenticated && (
              <div className="emoji-picker-container">
                <EmojiUrlyReactionPicker
                  onSelect={handleAddReaction}
                  type="report"
                  userId={userProfile?.id ?? ""}
                  descriptionId={descriptionId}
                />
              </div>
            )}
          </div>

          <button
            onClick={(event) =>
              !isAuthenticated
                ? triggerTooltip("Connecte-toi pour commenter", event)
                : onCommentClick()
            }
            aria-label="Commenter"
          >
            <MessageCircle size={isMobile ? 18 : 22} />
            {/* {is1350px ? null : (
              <span className="commenter-span-btn">Commenter</span>
            )} */}
          </button>
        </div>

        {/* 🟢 CENTRE : BOUTON SIGNALER MODIFIÉ */}
        {/* <div className="actions-center">
          <button
            className="signaler-btn-mobile"
            data-tooltip="Signaler"
            aria-label="Signaler"
            onClick={handleSignalerClick}
          >
            <img src={simpleLeftHand} alt="" />
            <span className="signaler-span-btn">J'ai aussi ce problème</span>
          </button>
        </div> */}

        <div className="actions-right">
          <button
            className="signaler-btn-mobile"
            data-tooltip="Signaler"
            aria-label="Signaler"
            onClick={handleSignalerClick}
          >
            <img src={simpleLeftHand} alt="" />
            {is1200px ? (
              <span className="signaler-span-btn">Signaler</span>
            ) : (
              <span className="signaler-span-btn">J'ai aussi ce problème</span>
            )}
          </button>
          <button
            className={`solution-btn ${solutionsCount > 0 ? "solution-btn-active" : "solution-btn-empty"}`}
            data-tooltip={solutionTooltipLabel}
            aria-label={solutionTooltipLabel}
            onClick={(event) =>
              !isAuthenticated
                ? triggerTooltip("Connecte-toi", event)
                : onOpenSolutionModal?.()
            }
          >
            <img
              src={solutionsCount > 0 ? lightBulbLight : lightBulbNoLight}
              width={22}
              height={22}
              alt="bulb"
            />
            <span className="solution-span-btn">
              {is1200px ? null : solutionsCount > 1 ? "Solutions" : "Solution"}{" "}
              ({solutionsCount})
            </span>
          </button>
        </div>
      </div>

      {/* 🟢 MODAL DE REDIRECTION (PORTAL) */}
      {showExtensionModal && (
        <RedirectionExtensionModal
          onClose={() => setShowExtensionModal(false)}
          brandName={brandName}
          url={siteUrl}
        />
      )}

      <AuthTooltip
        show={showAuthTooltip}
        text={tooltipText}
        position={tooltipPosition}
      />
    </div>
  );
};

export default ReportActionsBarWithReactions;
