import React from "react";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";

interface Props {
  userProfile: any;
  descriptionId: string;
  item: any;
  brandResponse?: any;
  hasBrandResponse: any;
  currentCount: number;
  handleCommentClick: () => void;
  handleToggleSimilarReports: () => void;
  isPublic: boolean;
  onOpenSolutionModal: () => void;
  solutionsCount?: number;
}

const PopularReportActions: React.FC<Props> = ({
  userProfile,
  descriptionId,
  brandResponse,
  item,
  hasBrandResponse,
  currentCount,
  handleCommentClick,
  handleToggleSimilarReports,
  onOpenSolutionModal,
  solutionsCount,
  isPublic,
}) => {
  return (
    <ReportActionsBarWithReactions
      userId={userProfile?.id}
      descriptionId={descriptionId}
      // On retire ou on met à 0 les props liées au compteur de signalements
      // pour éviter l'affichage du doublon (avatars + chiffre)
      reportsCount={0}
      descriptions={[]}
      showBrandResponseInline={true}
      status={item.status}
      type="report"
      solutionsCount={solutionsCount}
      hasBrandResponse={hasBrandResponse}
      brandResponse={brandResponse}
      commentsCount={currentCount}
      brandName={item.marque}
      siteUrl={item.siteUrl}
      onReactClick={() => {
        if (isPublic) return;
      }}
      onOpenSolutionModal={onOpenSolutionModal}
      onCommentClick={handleCommentClick}
      onToggleSimilarReports={handleToggleSimilarReports}
    />
  );
};

export default PopularReportActions;
