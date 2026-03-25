import CommentSection from "@src/components/comments/CommentSection";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import type { UserGroupedReport } from "@src/types/Reports";

interface Props {
  sub: UserGroupedReport;
  initialDescription: UserGroupedReport["descriptions"][number];
  userProfile: any;

  brand: string;
  siteUrl: string;

  showComments: Record<string, boolean>;
  showReactions: Record<string, boolean>;

  localCommentsCounts: Record<string, number>;
  setLocalCommentsCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;

  refreshCommentsKeys: Record<string, number>;
  setRefreshCommentsKeys: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}

const ReportInteractions: React.FC<Props> = ({
  sub,
  initialDescription,
  userProfile,
  brand,
  siteUrl,
  showComments,
  showReactions,
  setLocalCommentsCounts,
  refreshCommentsKeys,
  setRefreshCommentsKeys,
}) => {
  const key = sub.subCategory;

  if (!userProfile?.id) return null;

  return (
    <>
      {/* COMMENTS */}
      {showComments[key] && (
        <>
          <CommentSection
            descriptionId={initialDescription.id}
            type="report"
            brand={brand}
            brandSiteUrl={siteUrl}
            reportIds={[sub.reportingId]}
            onCommentAdded={() => {
              setLocalCommentsCounts((prev) => ({
                ...prev,
                [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
              }));

              setRefreshCommentsKeys((prev) => ({
                ...prev,
                [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
              }));
            }}
            onCommentDeleted={() => {
              setLocalCommentsCounts((prev) => ({
                ...prev,
                [initialDescription.id]: Math.max(
                  (prev[initialDescription.id] ?? 1) - 1,
                  0,
                ),
              }));

              setRefreshCommentsKeys((prev) => ({
                ...prev,
                [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
              }));
            }}
          />

          <DescriptionCommentSection
            userId={userProfile.id}
            descriptionId={initialDescription.id}
            type="report"
            hideFooter
            brand={brand}
            brandSiteUrl={siteUrl}
            reportIds={sub.hasBrandResponse ? [sub.reportingId] : []}
            refreshKey={refreshCommentsKeys[initialDescription.id] ?? 0}
          />
        </>
      )}

      {/* REACTIONS */}
      {showReactions[key] && (
        <DescriptionCommentSection
          userId={userProfile.id}
          descriptionId={initialDescription.id}
          type="report"
          modeCompact
          brand={brand}
          brandSiteUrl={siteUrl}
          reportIds={sub.hasBrandResponse ? [sub.reportingId] : []}
        />
      )}
    </>
  );
};

export default ReportInteractions;
