import React, { useRef, useState } from "react";
import { ThumbsUp, MessageCircle, Hand } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { TICKET_STATUSES, type TicketStatusKey } from "@src/types/ticketStatus";
import type { HasBrandResponse } from "@src/types/brandResponse";
import ReportAvatars from "@src/pages/public/components/ReportAvatar/ReportsAvatar";
import type { User } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import lightBulbLight from "/assets/icons/lightBulbLight.svg";
import lightBulbNoLight from "/assets/icons/lightBulbNoLight.svg";
import RedirectionExtensionModal from "../modal/RedirectionExtensionModal";

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
}) => {
  const { userProfile } = useAuth();
  const isAuthenticated = !!userProfile?.id;

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
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  if (!statusConfig) return null;

  // --- LOGIQUE DU CLIC SIGNALER ---
  const handleSignalerClick = () => {
    if (!isAuthenticated) {
      triggerTooltip("Connecte-toi pour signaler");
      return;
    }

    // Détection simple Desktop (largeur > 768px par exemple)
    const isDesktop = window.innerWidth > 768;

    if (isDesktop) {
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

  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);
    setTimeout(() => setShowAuthTooltip(false), 2000);
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
    <div className="report-actions-bar">
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
                <span className="resignalements-label"> signalements</span>
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
              onClick={() =>
                !isAuthenticated && triggerTooltip("Connecte-toi pour réagir")
              }
            >
              <ThumbsUp size={18} />
              <span className="reagir-span-btn">Réagir</span>
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
            onClick={() =>
              !isAuthenticated
                ? triggerTooltip("Connecte-toi pour commenter")
                : onCommentClick()
            }
          >
            <MessageCircle size={18} />
            <span className="commenter-span-btn">Commenter</span>
          </button>
        </div>

        {/* 🟢 CENTRE : BOUTON SIGNALER MODIFIÉ */}
        <div className="actions-center">
          <button className="signaler-btn-mobile" onClick={handleSignalerClick}>
            <Hand size={18} />
            <span className="signaler-span-btn">Signaler</span>
          </button>
        </div>

        <div className="actions-right">
          <button
            className={`solution-btn ${solutionsCount > 0 ? "solution-btn-active" : "solution-btn-empty"}`}
            onClick={() =>
              !isAuthenticated
                ? triggerTooltip("Connecte-toi")
                : onOpenSolutionModal?.()
            }
          >
            <img
              src={solutionsCount > 0 ? lightBulbLight : lightBulbNoLight}
              width={26}
              height={26}
              alt="bulb"
            />
            <span className="solution-span-btn">({solutionsCount})</span>
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

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default ReportActionsBarWithReactions;
