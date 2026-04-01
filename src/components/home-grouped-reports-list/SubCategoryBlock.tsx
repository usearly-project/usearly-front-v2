import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { getBrandLogo } from "@src/utils/brandLogos";
import { pastelColors } from "@src/components/constants/pastelColors";
import Champs from "@src/components/champs/Champs";
import CommentSection from "@src/components/comments/CommentSection";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";

// --- TYPES & CONSTANTES ---
type SignalementFilterValue = "pertinent" | "recents" | "anciens";
const signalementFilterOptions = [
  { value: "pertinent", label: "Les plus pertinents" },
  { value: "recents", label: "Les plus récents" },
  { value: "anciens", label: "Les plus anciens" },
];

interface SubCategoryBlockProps {
  sub: any;
  brand: string;
  siteUrl: string;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  commentsCounts: Record<string, number>;
  brandResponsesMap: Record<string, any>;
}

const SubCategoryBlock: React.FC<SubCategoryBlockProps> = ({
  sub,
  brand,
  siteUrl,
  index,
  isExpanded,
  onToggle,
  commentsCounts,
  brandResponsesMap,
}) => {
  const [filter, setFilter] = useState<SignalementFilterValue>("pertinent");
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showAll] = useState(false);
  const [expandedOthers, setExpandedOthers] = useState(false);
  const initialDescription = sub.descriptions[0];
  const additionalDescriptions = sub.descriptions.slice(1);

  // Logique de tri
  const sortedDescriptions = [...additionalDescriptions].sort((a, b) => {
    if (filter === "recents")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filter === "anciens")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const displayedDescriptions = expandedOthers
    ? showAll
      ? sortedDescriptions
      : sortedDescriptions.slice(0, 2)
    : [];

  return (
    <div
      className={`subcategory-block ${isExpanded ? "open" : ""}`}
      style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
    >
      <div className="subcategory-header" onClick={onToggle}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(sub.subCategory)}
            alt=""
            className="subcategory-icon"
          />
          <h4>{sub.subCategory}</h4>
        </div>
        <div className="subcategory-right">
          {!isExpanded && (
            <div className="badge-count">{sub.descriptions.length}</div>
          )}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="subcategory-content">
          <div className="main-description">
            <p className="description-text">{initialDescription.description}</p>
          </div>

          <ReportActionsBarWithReactions
            userId={""} // À remplacer par l'ID utilisateur réel si disponible
            descriptionId={initialDescription.id}
            reportsCount={sub.count}
            brandLogoUrl={getBrandLogo(brand, siteUrl)}
            commentsCount={commentsCounts[initialDescription.id] ?? 0}
            status={sub.status}
            // --- LES PROPS MANQUANTES ICI ---
            type="report" // Important pour différencier signalement/suggestion
            hasBrandResponse={sub.reportIds.some(
              (id: string) => brandResponsesMap?.[id],
            )} // Logique à vérifier selon tes data
            onReactClick={() => {
              setShowReactions(!showReactions);
              // On ferme les autres sections si on ouvre les réactions
              if (!showReactions) {
                setShowComments(false);
                setExpandedOthers(false);
              }
            }}
            onCommentClick={() => {
              const newState = !showComments;
              setShowComments(newState);
              if (newState) {
                setExpandedOthers(false);
                setShowReactions(false);
              }
            }}
            onToggleSimilarReports={() => {
              const newState = !expandedOthers;
              setExpandedOthers(newState);
              if (newState) {
                setShowComments(false);
                setShowReactions(false);
              }
            }}
          />

          {showComments && (
            <CommentSection
              descriptionId={initialDescription.id}
              type="report"
              brand={brand}
              brandSiteUrl={siteUrl}
            />
          )}

          {expandedOthers && (
            <div className="other-descriptions">
              <Champs
                options={signalementFilterOptions}
                value={filter}
                onChange={(v) => setFilter(v as any)}
              />
              {displayedDescriptions.map((desc) => (
                <div key={desc.id} className="feedback-card">
                  {/* ... rendu de la carte simplifié ... */}
                  <p>{desc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategoryBlock;
