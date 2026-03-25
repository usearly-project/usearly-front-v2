import { useEffect, useState } from "react";
import type { UserGroupedReport } from "@src/types/Reports";
import "./UserBrandBlock.scss";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";
import { getCommentsCountForDescription } from "@src/services/commentService";
import { parseISO, isAfter } from "date-fns";
import { useAuth } from "@src/services/AuthContext";
import BrandHeader from "./components/BrandHeader";
import Lightbox from "./components/Lightbox";
import SolutionsModals from "./components/SolutionsModals";
import MainDescription from "./components/MainDescription";
import OtherDescriptions from "./components/OtherDescriptions";
import SubcategoryHeader from "./components/SubcategoryHeader";
import ReportInteractions from "./components/ReportInteractions";

interface Props {
  brand: string;
  siteUrl: string;
  reports: UserGroupedReport[];
  isOpen: boolean;
  onToggle: () => void;
}

const UserBrandBlock: React.FC<Props> = ({
  brand,
  reports,
  isOpen,
  onToggle,
  siteUrl,
}) => {
  const { userProfile } = useAuth();

  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [expandedOthers, setExpandedOthers] = useState<Record<string, boolean>>(
    {},
  );
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [showReactions, setShowReactions] = useState<Record<string, boolean>>(
    {},
  );
  const [showFullText, setShowFullText] = useState<Record<string, boolean>>({});
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionsList, setShowSolutionsList] = useState(false);
  const [, setCommentsCounts] = useState<Record<string, number>>({});
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [refreshCommentsKeys, setRefreshCommentsKeys] = useState<
    Record<string, number>
  >({});
  const [signalementFilters, setSignalementFilters] = useState<
    Record<string, "pertinent" | "recents" | "anciens">
  >({});

  useEffect(() => {
    const fetchAllCounts = async () => {
      const newCounts: Record<string, number> = {};
      for (const sub of reports) {
        for (const desc of sub.descriptions) {
          try {
            const res = await getCommentsCountForDescription(desc.id);
            newCounts[desc.id] = res.data.commentsCount ?? 0;
          } catch (err) {
            console.error(`Erreur pour descriptionId ${desc.id} :`, err);
            newCounts[desc.id] = 0;
          }
        }
      }
      setCommentsCounts(newCounts);
      setLocalCommentsCounts(newCounts);
    };
    fetchAllCounts();
  }, [reports]);

  const getMostRecentDate = () => {
    let latest: Date | null = null;

    for (const sub of reports) {
      for (const desc of sub.descriptions) {
        const date = parseISO(desc.createdAt);
        if (!latest || isAfter(date, latest)) {
          latest = date;
        }
      }
    }

    return latest;
  };

  const mostRecentDate = getMostRecentDate();

  return (
    <div className={`brand-block ${isOpen ? "open" : "close"}`}>
      <BrandHeader
        reportsLength={reports.length}
        brand={brand}
        siteUrl={siteUrl}
        mostRecentDate={mostRecentDate}
        onToggle={onToggle}
      />

      {isOpen && (
        <div className="subcategories-list">
          {reports.map((sub) => {
            const initialDescription = sub.descriptions[0];
            const solutionsCount = sub.solutionsCount ?? 0;
            const safeAuthor = {
              id: initialDescription.author?.id ?? undefined,
              pseudo: initialDescription.author?.pseudo ?? "Utilisateur",
              avatar: initialDescription.author?.avatar ?? undefined,
              email: initialDescription.author?.email ?? undefined,
            };
            const currentCount =
              localCommentsCounts[initialDescription.id] ?? 0;

            const additionalDescriptions = sub.descriptions.slice(1);
            const hasMoreThanTwo = additionalDescriptions.length > 2;
            const sortedDescriptions = [...additionalDescriptions].sort(
              (a, b) => {
                const filter =
                  signalementFilters[sub.subCategory] || "pertinent";
                if (filter === "recents")
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                if (filter === "anciens")
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                return 0;
              },
            );

            const displayedDescriptions = expandedOthers[sub.subCategory]
              ? showAll[sub.subCategory]
                ? sortedDescriptions
                : sortedDescriptions.slice(0, 2)
              : [];

            return (
              <div
                key={sub.subCategory}
                className={`subcategory-block ${
                  expandedSub === sub.subCategory ? "open" : ""
                }`}
              >
                <SubcategoryHeader
                  sub={sub}
                  brand={brand}
                  siteUrl={siteUrl}
                  expandedSub={expandedSub}
                  setExpandedSub={setExpandedSub}
                  safeAuthor={safeAuthor}
                />

                {expandedSub === sub.subCategory && (
                  <div className="subcategory-content">
                    <MainDescription
                      sub={sub}
                      initialDescription={initialDescription}
                      brand={brand}
                      siteUrl={siteUrl}
                      showFullText={showFullText}
                      setShowFullText={setShowFullText}
                      setModalImage={setModalImage}
                    />
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
                        setShowReactions((prev) => ({
                          ...prev,
                          [sub.subCategory]: !prev[sub.subCategory],
                        }))
                      }
                      onCommentClick={() => {
                        setShowComments((prev) => {
                          const newState = !prev[sub.subCategory];
                          if (newState) setExpandedOthers({});
                          return { ...prev, [sub.subCategory]: newState };
                        });
                      }}
                      onToggleSimilarReports={() => {
                        setExpandedOthers((prev) => ({
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
                    <ReportInteractions
                      sub={sub}
                      initialDescription={initialDescription}
                      userProfile={userProfile}
                      brand={brand}
                      siteUrl={siteUrl}
                      showComments={showComments}
                      showReactions={showReactions}
                      localCommentsCounts={localCommentsCounts}
                      setLocalCommentsCounts={setLocalCommentsCounts}
                      refreshCommentsKeys={refreshCommentsKeys}
                      setRefreshCommentsKeys={setRefreshCommentsKeys}
                    />

                    {expandedOthers[sub.subCategory] && (
                      <>
                        <OtherDescriptions
                          sub={sub}
                          displayedDescriptions={displayedDescriptions}
                          hasMoreThanTwo={hasMoreThanTwo}
                          showAll={showAll}
                          setShowAll={setShowAll}
                          signalementFilters={signalementFilters}
                          setSignalementFilters={setSignalementFilters}
                          brand={brand}
                          userProfile={userProfile}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalImage && (
        <Lightbox image={modalImage} onClose={() => setModalImage(null)} />
      )}
      <SolutionsModals
        activeReportId={activeReportId}
        showSolutionModal={showSolutionModal}
        showSolutionsList={showSolutionsList}
        setShowSolutionModal={setShowSolutionModal}
        setShowSolutionsList={setShowSolutionsList}
      />
    </div>
  );
};

export default UserBrandBlock;
