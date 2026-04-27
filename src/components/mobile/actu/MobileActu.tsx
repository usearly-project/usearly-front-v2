import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./MobileActu.scss";

import Avatar from "@src/components/shared/Avatar";
import { truncate } from "@src/utils/stringUtils";
import { formatRelative } from "@src/utils/dateUtils";
import FeedbackRight from "@src/components/InteractiveFeedbackCard/FeedbackRight";
import FeedbackLeft from "@src/components/InteractiveFeedbackCard/feedback-left/FeedbackLeft";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import PopularReportActions from "@src/components/report-grouped/reports-popular/popular-report-header/PopularReportActions";
import PopularReportComments from "@src/components/report-grouped/reports-popular/popular-report-header/PopularReportComments";
import SolutionModal from "@src/components/ui/SolutionModal";
import SolutionsModal from "@src/components/ui/SolutionsModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@src/components/ui/tooltip";
import ConfirmReportPopup from "./ConfirmReportPopup";

import { useAuth } from "@src/services/AuthContext";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import starProgressBar from "/assets/icons/icon-progress-bar.svg";
import { useMobileActu } from "../hooks/useMobileActu";

const DEFAULT_SUBCATEGORY_ICON_WIDTH = 60;

interface MobileActuProps {
  item: any;
  type: "report" | "suggestion" | "cdc";
  isPublic?: boolean;
}

const MobileActu: React.FC<MobileActuProps> = ({
  item,
  type,
  isPublic = false,
}) => {
  const { userProfile } = useAuth();
  const barRef = useRef<HTMLDivElement>(null);
  const subcategoryIconRef = useRef<HTMLImageElement>(null);
  const [subcategoryIconWidth, setSubcategoryIconWidth] = useState(
    DEFAULT_SUBCATEGORY_ICON_WIDTH,
  );
  const { state, actions } = useMobileActu(item, type, userProfile);

  const isReport = type === "report";
  const firstDesc = isReport ? state.localDescriptions[0] : item;
  const author = isReport ? firstDesc?.author : item.author;
  const brandName = isReport ? item.marque : item.brand || item.marque;
  const userCapture = firstDesc?.capture || item.capture;
  const reportersTooltipLabel = "re signalement";
  const relativeCreatedAt = firstDesc?.createdAt
    ? formatRelative(firstDesc.createdAt).replace(/^il y a /, "")
    : "";

  useEffect(() => {
    if (!isReport) return;

    const icon = subcategoryIconRef.current;
    if (!icon) return;

    const updateIconWidth = () => {
      const width = icon.getBoundingClientRect().width;

      if (width > 0) {
        setSubcategoryIconWidth(width);
      }
    };

    updateIconWidth();
    icon.addEventListener("load", updateIconWidth);

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateIconWidth);
      resizeObserver.observe(icon);
    }

    return () => {
      icon.removeEventListener("load", updateIconWidth);
      resizeObserver?.disconnect();
    };
  }, [isReport, item.subCategory]);

  return (
    <div className={`mobile-actu-card type-${type}`}>
      {!isReport ? (
        <FeedbackRight
          item={{
            ...item,
            votes: state.localVotes,
            type: type === "suggestion" ? "suggestion" : "coupdecoeur",
          }}
          isMobile={true}
          renderMobileVisual={<FeedbackLeft item={item} isExpanded={false} />}
          userProfile={userProfile}
          votes={state.localVotes}
          onVoteClick={actions.handleVoteClick}
          max={300}
          barRef={barRef}
          thumbLeft={0}
          showComments={state.showComments}
          onToggleComments={() => actions.setShowComments(!state.showComments)}
          commentCount={state.commentCount}
          isGuest={!userProfile?.id}
          showHeaderTypeIcon={true}
          starProgressBar={starProgressBar}
          setSelectedImage={() => {}}
          selectedImage={null}
          isExpired={false}
          expiresInDays={null}
        />
      ) : (
        <>
          <div className="mobile-actu-header">
            <div className="header-reporters">
              {state.localCount > 0 && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="reporters-inline-stack"
                        aria-label={reportersTooltipLabel}
                      >
                        <div className="avatar-pile">
                          {state.localDescriptions
                            .slice(0, 3)
                            .map((r: any, i: number) => (
                              <div
                                key={r.id || i}
                                className="pile-item"
                                style={{ zIndex: 3 - i }}
                              >
                                <Avatar
                                  avatar={r.author?.avatar}
                                  pseudo={r.author?.pseudo}
                                  type="user"
                                  sizeHW={24}
                                />
                              </div>
                            ))}
                        </div>
                        <span className="count">{state.localCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="reporters-tooltip">
                      {reportersTooltipLabel}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="header-author">
              <span className="author-text">
                {truncate(author?.pseudo, 8, ".")} x{" "}
                <strong>{truncate(brandName, 8, ".")}</strong>
              </span>
              <div className="avatar-overlap-wrapper">
                <Avatar
                  avatar={author?.avatar}
                  pseudo={author?.pseudo}
                  type="user"
                  sizeHW={50}
                />
                <div className="brand-badge">
                  <Avatar
                    avatar={
                      isReport
                        ? item.hasBrandResponse?.avatar
                        : item.illustration
                    }
                    pseudo={brandName}
                    type="brand"
                    sizeHW={50}
                    preferBrandLogo={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="mobile-actu-body"
            style={
              {
                "--subcategory-icon-width": `${subcategoryIconWidth}px`,
              } as React.CSSProperties
            }
          >
            <div className="title-row">
              <div className="title-group">
                <img
                  ref={subcategoryIconRef}
                  src={getCategoryIconPathFromSubcategory(item.subCategory)}
                  alt=""
                  className="subcategory-icon"
                />
                <h3 className="title">
                  {item.subCategory}
                  {relativeCreatedAt && (
                    <span className="date">⸱ {relativeCreatedAt}</span>
                  )}
                </h3>
              </div>
            </div>
            <div className="description-container">
              <p
                className={`description ${state.isExpanded ? "expanded" : ""}`}
              >
                {firstDesc?.description}
              </p>
              <span
                className="see-more"
                onClick={() => actions.setIsExpanded(!state.isExpanded)}
              >
                {state.isExpanded ? "Voir moins" : "Voir plus"}
              </span>
              {state.isExpanded && userCapture && (
                <div
                  className="user-capture-wrapper"
                  onClick={() => actions.setSelectedZoomImage(userCapture)}
                >
                  <img
                    src={userCapture}
                    alt="Capture"
                    className="user-capture-img"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mobile-actu-footer">
            <PopularReportActions
              userProfile={userProfile}
              item={item}
              descriptionId={firstDesc?.id || ""}
              hasBrandResponse={!!item.hasBrandResponse}
              currentCount={
                state.localCommentsCounts[firstDesc?.id || ""] ??
                item.commentsCount
              }
              isPublic={isPublic}
              solutionsCount={state.solutionsCount}
              handleCommentClick={() =>
                actions.setShowComments(!state.showComments)
              }
              handleToggleSimilarReports={() =>
                actions.setShowConfirmPopup(true)
              }
              onOpenSolutionModal={() =>
                state.solutionsCount > 0
                  ? actions.setShowSolutionsList(true)
                  : actions.setShowSolutionModal(true)
              }
              hideReporters={true}
            />
          </div>
        </>
      )}

      {state.showComments && (
        <div className="mobile-comments-section">
          {isReport ? (
            <PopularReportComments
              userProfile={userProfile}
              descriptionId={firstDesc?.id}
              showComments={true}
              brandResponse={!!item.hasBrandResponse}
              setLocalCommentsCounts={actions.setLocalCommentsCounts}
              setRefreshKey={actions.setRefreshKey}
            />
          ) : (
            <DescriptionCommentSection
              userId={userProfile?.id || ""}
              descriptionId={item.id}
              type={type === "cdc" ? "coupdecoeur" : "suggestion"}
              forceOpen
              hideFooter
              onCommentCountChange={actions.setCommentCount}
            />
          )}
        </div>
      )}

      {/* PORTALS & MODALS */}
      {state.showSolutionModal && (
        <SolutionModal
          reportId={item.reportingId || item.id}
          onClose={() => actions.setShowSolutionModal(false)}
          onSuccess={() => actions.setShowSolutionModal(false)}
        />
      )}
      {state.showSolutionsList && (
        <SolutionsModal
          reportId={item.reportingId || item.id}
          onClose={() => actions.setShowSolutionsList(false)}
          onAddSolution={() => {
            actions.incrementSolutionsCount();
            actions.setShowSolutionsList(false);
            actions.setShowSolutionModal(true);
          }}
        />
      )}
      {state.showConfirmPopup &&
        createPortal(
          <ConfirmReportPopup
            item={item}
            description={firstDesc?.description}
            count={state.localCount}
            onClose={() => actions.setShowConfirmPopup(false)}
            onConfirm={actions.handleReportConfirm}
          />,
          document.body,
        )}
      {state.selectedZoomImage &&
        createPortal(
          <div
            className="image-zoom-overlay"
            onClick={() => actions.setSelectedZoomImage(null)}
          >
            <img
              src={state.selectedZoomImage}
              className="zoomed-img"
              alt="zoom"
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MobileActu;
