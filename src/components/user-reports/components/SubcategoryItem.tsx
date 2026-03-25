import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import type { UserGroupedReport } from "@src/types/Reports";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";

interface Props {
  sub: UserGroupedReport;
  brand: string;
  siteUrl: string;
  userProfile: any;

  expandedSub: string | null;
  setExpandedSub: (v: any) => void;

  expandedOthers: Record<string, boolean>;
  setExpandedOthers: (v: any) => void;

  showAll: Record<string, boolean>;
  setShowAll: (v: any) => void;

  showComments: Record<string, boolean>;
  setShowComments: (v: any) => void;

  showReactions: Record<string, boolean>;
  setShowReactions: (v: any) => void;

  showFullText: Record<string, boolean>;
  setShowFullText: (v: any) => void;

  localCommentsCounts: Record<string, number>;
  setLocalCommentsCounts: (v: any) => void;

  refreshCommentsKeys: Record<string, number>;
  setRefreshCommentsKeys: (v: any) => void;

  signalementFilters: Record<string, any>;
  setSignalementFilters: (v: any) => void;

  setActiveReportId: (v: string) => void;
  setShowSolutionModal: (v: boolean) => void;
  setShowSolutionsList: (v: boolean) => void;

  setModalImage: (v: string) => void;
}

const SubcategoryItem: React.FC<Props> = ({
  sub,
  userProfile,
  expandedSub,
  setExpandedSub,
  setExpandedOthers,
  setShowComments,
  setShowReactions,
  localCommentsCounts,
  setActiveReportId,
  setShowSolutionModal,
  setShowSolutionsList,
}) => {
  const initialDescription = sub.descriptions[0];
  const solutionsCount = sub.solutionsCount ?? 0;
  const currentCount = localCommentsCounts[initialDescription.id] ?? 0;
  return (
    <div
      className={`subcategory-block ${
        expandedSub === sub.subCategory ? "open" : ""
      }`}
    >
      <div
        className="subcategory-header"
        onClick={() =>
          setExpandedSub((prev: any) =>
            prev === sub.subCategory ? null : sub.subCategory,
          )
        }
      >
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(sub.subCategory)}
            alt={sub.subCategory}
          />
          <h4>{sub.subCategory}</h4>
        </div>

        <div className="subcategory-right">
          <div className="badge-count">{sub.count}</div>

          {expandedSub === sub.subCategory ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
      </div>

      {expandedSub === sub.subCategory && (
        <div className="subcategory-content">
          <p>{initialDescription.description}</p>

          <ReportActionsBarWithReactions
            userId={userProfile?.id || ""}
            type="report"
            descriptionId={initialDescription.id}
            status={sub.status}
            reportsCount={sub.count}
            hasBrandResponse={sub.hasBrandResponse}
            commentsCount={currentCount}
            solutionsCount={solutionsCount}
            onReactClick={() =>
              setShowReactions((prev: any) => ({
                ...prev,
                [sub.subCategory]: !prev[sub.subCategory],
              }))
            }
            onCommentClick={() => {
              setShowComments((prev: any) => {
                const newState = !prev[sub.subCategory];
                if (newState) setExpandedOthers({});
                return { ...prev, [sub.subCategory]: newState };
              });
            }}
            onToggleSimilarReports={() => {
              setExpandedOthers((prev: any) => ({
                ...prev,
                [sub.subCategory]: !prev[sub.subCategory],
              }));
              setShowComments({});
            }}
            onOpenSolutionModal={() => {
              setActiveReportId(sub.reportingId);

              if (solutionsCount > 0) {
                setShowSolutionsList(true);
              } else {
                setShowSolutionModal(true);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SubcategoryItem;
