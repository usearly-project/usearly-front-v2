import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Lightbulb } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { TICKET_STATUSES, type TicketStatusKey } from "@src/types/ticketStatus";
import type { HasBrandResponse } from "@src/types/brandResponse";
import { getBrandAvatarFromResponse } from "@src/utils/brandResponse";
import ReportAvatars from "@src/pages/public/components/ReportAvatar/ReportsAvatar";
import type { User } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import BrandResponseBanner from "@src/components/brand-response-banner/BrandResponseBanner";
import lightBulbLight from "/assets/icons/lightBulbLight.svg";

interface Props {
  type: "report" | "suggestion" | "coupDeCoeur";
  userId?: string;
  solutionsCount?: number;
  descriptionId: string;
  reportsCount: number;
  reportId?: string;
  hasBrandResponse?: HasBrandResponse;
  commentsCount: number;
  status: TicketStatusKey;
  brandLogoUrl?: string;
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
  hasBrandResponse,
  status,
  solutionsCount = 0,
  onCommentClick,
  onToggleSimilarReports,
  descriptions,
  onOpenSolutionModal,
}) => {
  const { userProfile } = useAuth();
  const isAuthenticated = !!userProfile?.id;
  const { getCount, handleReact } = useReactionsForDescription(
    userProfile?.id ?? "",
    descriptionId,
  );
  const emojis = getEmojisForType("report");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  let hoverTimeout: NodeJS.Timeout;
  const statusConfig = TICKET_STATUSES.find((s) => s.key === status);
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  console.log("PROPS", {
    reportsCount,
    descriptions,
  });

  if (!statusConfig) {
    console.warn("❌ Status inconnu reçu:", status);
    return null; // ou un badge neutre "—"
  }
  // ✅ Récupérer toutes les réactions avec leur count
  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = allReactions.reduce((acc, r) => acc + r.count, 0);
  const brandAvatar = getBrandAvatarFromResponse(hasBrandResponse);
  const brandResponse =
    hasBrandResponse && typeof hasBrandResponse === "object"
      ? hasBrandResponse
      : null;
  const brandResponseMessage = brandResponse?.message?.trim();

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

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };
  const reporters = (descriptions ?? [])
    .map((d) => d.author)
    .filter((u): u is User => !!u);

  return (
    <div className="report-actions-bar">
      {brandResponse && brandResponseMessage && (
        <div className="report-brand-response-banner">
          <BrandResponseBanner
            message={brandResponseMessage}
            createdAt={brandResponse.createdAt ?? undefined}
            brand={
              brandResponse.brand ??
              brandAvatar?.pseudo ??
              brandAvatar?.displayName ??
              "Marque"
            }
            brandSiteUrl={
              brandResponse.siteUrl ?? brandAvatar?.siteUrl ?? undefined
            }
            brandResponse={brandResponse}
          />
        </div>
      )}

      <div className="counts-row">
        <div className="count-left">
          {topThree.length > 0 && (
            <div>
              {topThree.map((r) => (
                <span
                  key={r.emoji}
                  role="img"
                  aria-label="reaction"
                  className="emoji-icon"
                >
                  {r.emoji}
                </span>
              ))}
              <span className="reaction-count">{totalCount}</span>
            </div>
          )}
          {commentsCount > 0 && (
            <>
              <span className="comments-link" onClick={onCommentClick}>
                {commentsCount}{" "}
                {commentsCount === 1 ? "commentaire" : "commentaires"}
              </span>
            </>
          )}
        </div>

        <div className="count-right">
          <div className="signalements-avatars">
            {reporters.length > 0 && <ReportAvatars users={reporters} />}

            {reportsCount > 0 && (
              <span
                className="resignalements-link"
                onClick={onToggleSimilarReports}
              >
                <span className="resignalements-count">{reportsCount}</span>
                <span className="resignalements-label">
                  {reportsCount === 1 ? " signalement" : " signalements"}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="separator" />

      <div className="actions-row">
        <div className="actions-left">
          <div
            className="react-hover-area"
            onMouseEnter={() => {
              if (!isAuthenticated) {
                triggerTooltip("Connecte-toi pour réagir");
                return;
              }

              if (hoverTimeout) clearTimeout(hoverTimeout);
              setShowEmojiPicker(true);
            }}
            onMouseLeave={() => {
              hoverTimeout = setTimeout(() => {
                setShowEmojiPicker(false);
              }, 250);
            }}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  triggerTooltip("Connecte-toi pour réagir");
                  return;
                }
              }}
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
            onClick={() => {
              if (!userProfile?.id) {
                triggerTooltip("Connecte-toi pour commenter");
                return;
              }

              onCommentClick();
            }}
          >
            <MessageCircle size={18} />
            <span className="commenter-span-btn">Commenter</span>
          </button>
        </div>

        <div className="actions-right">
          <button
            className={`solution-btn ${
              solutionsCount > 0 ? "solution-btn-active" : "solution-btn-empty"
            }`}
            onClick={() => {
              if (!userProfile?.id) {
                triggerTooltip("Connecte-toi pour proposer une solution");
                return;
              }
              console.log("SOLUTION...: ", solutionsCount);
              onOpenSolutionModal?.();
            }}
          >
            {solutionsCount > 0 ? (
              <img src={lightBulbLight} height={"18px"} width={"18px"} alt="" />
            ) : (
              <Lightbulb size={18} />
            )}

            <span>
              {solutionsCount > 0
                ? `Solution (${solutionsCount})`
                : "Proposer une solution"}
            </span>
          </button>
        </div>
      </div>
      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default ReportActionsBarWithReactions;
