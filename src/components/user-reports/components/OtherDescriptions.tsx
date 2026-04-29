import { ChevronDown } from "lucide-react";
import type { UserGroupedReport } from "@src/types/Reports";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "@src/components/shared/Avatar";
import { compactRelativeDateLabel } from "@src/utils/dateUtils";

interface Props {
  sub: UserGroupedReport;
  displayedDescriptions: UserGroupedReport["descriptions"];
  hasMoreThanTwo: boolean;

  showAll: Record<string, boolean>;
  setShowAll: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  signalementFilters: Record<string, "pertinent" | "recents" | "anciens">;
  setSignalementFilters: React.Dispatch<
    React.SetStateAction<Record<string, "pertinent" | "recents" | "anciens">>
  >;

  brand: string;
  userProfile: any;
}

const OtherDescriptions: React.FC<Props> = ({
  sub,
  displayedDescriptions,
  hasMoreThanTwo,
  showAll,
  setShowAll,
  signalementFilters,
  setSignalementFilters,
  brand,
  userProfile,
}) => {
  return (
    <>
      <div className="other-descriptions">
        <div className="signalement-filter">
          <label className="filter-label">Tous les signalements :</label>

          <select
            value={signalementFilters[sub.subCategory] || "pertinent"}
            onChange={(e) =>
              setSignalementFilters((prev) => ({
                ...prev,
                [sub.subCategory]: e.target.value as
                  | "pertinent"
                  | "recents"
                  | "anciens",
              }))
            }
            className="filter-select"
          >
            <option value="pertinent">Les plus pertinents</option>
            <option value="recents">Les plus récents</option>
            <option value="anciens">Les plus anciens</option>
          </select>
        </div>

        {displayedDescriptions.map((desc) => (
          <div className="feedback-card" key={desc.id}>
            {/* Avatar + emoji */}
            <div className="feedback-avatar">
              <div className="feedback-avatar-wrapper">
                <Avatar
                  avatar={desc.author?.avatar || null}
                  pseudo={desc.author?.pseudo || "?"}
                  type="user"
                  className="avatar"
                  wrapperClassName="avatar-wrapper-override"
                />

                {desc.emoji && (
                  <div className="emoji-overlay">{desc.emoji}</div>
                )}
              </div>
            </div>

            {/* Contenu */}
            <div className="feedback-content">
              <div className="feedback-meta">
                <span className="pseudo">
                  {desc.author?.pseudo || "Utilisateur"}
                </span>

                {userProfile?.id &&
                  desc.author?.id &&
                  userProfile.id === desc.author.id && (
                    <span className="badge-me">Moi</span>
                  )}

                <span className="brand"> · {brand}</span>

                <span className="time">
                  {" "}
                  ·{" "}
                  {compactRelativeDateLabel(
                    formatDistanceToNow(new Date(desc.createdAt), {
                      locale: fr,
                      addSuffix: true,
                    }),
                  )}
                </span>
              </div>

              <p className="feedback-text">{desc.description}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMoreThanTwo && !showAll[sub.subCategory] && (
        <button
          className="see-more-button"
          onClick={() =>
            setShowAll((prev) => ({
              ...prev,
              [sub.subCategory]: true,
            }))
          }
          aria-label="Afficher plus de signalements"
        >
          <ChevronDown size={14} /> Afficher plus de signalements
        </button>
      )}
    </>
  );
};

export default OtherDescriptions;
