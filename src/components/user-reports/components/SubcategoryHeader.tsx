import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import type { UserGroupedReport } from "@src/types/Reports";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import signalIconThin from "/assets/icons/signal-icon-thin.svg";

interface Props {
  sub: UserGroupedReport;
  brand: string;
  siteUrl: string;
  expandedSub: string | null;
  setExpandedSub: React.Dispatch<React.SetStateAction<string | null>>;
  safeAuthor: {
    id?: string;
    pseudo: string;
    avatar?: string;
    email?: string;
  };
}

const SubcategoryHeader: React.FC<Props> = ({
  sub,
  brand,
  siteUrl,
  expandedSub,
  setExpandedSub,
  safeAuthor,
}) => {
  const isOpen = expandedSub === sub.subCategory;

  return (
    <div
      className="subcategory-header"
      onClick={() =>
        setExpandedSub((prev) =>
          prev === sub.subCategory ? null : sub.subCategory,
        )
      }
    >
      <div className="subcategory-left">
        <img
          src={getCategoryIconPathFromSubcategory(sub.subCategory)}
          alt={sub.subCategory}
          className="subcategory-icon"
        />
        <h4>{sub.subCategory}</h4>
      </div>

      <div className="subcategory-right">
        {!isOpen && (
          <>
            <span className="date-subcategory">
              {formatDistanceToNow(new Date(sub.descriptions[0].createdAt), {
                locale: fr,
                addSuffix: true,
              }).replace("environ ", "")}
            </span>
            <div className="badge-count">
              {sub.count}
              <img
                src={signalIconThin}
                className="badge-count-icon"
                alt="icon signalement"
              />
            </div>
          </>
        )}

        {isOpen && (
          <div className="subcategory-user-brand-info">
            <div className="avatars-row">
              <Avatar
                avatar={safeAuthor.avatar ?? null}
                pseudo={safeAuthor.pseudo}
                type="user"
                wrapperClassName="avatar user-avatar"
              />
              <Avatar
                avatar={null}
                pseudo={brand}
                type="brand"
                siteUrl={siteUrl}
                wrapperClassName="avatar brand-logo"
              />
            </div>

            <div className="user-brand-names">
              <UserBrandLine
                userId={safeAuthor.id}
                email={safeAuthor.email}
                pseudo={safeAuthor.pseudo}
                brand={brand}
                type="report"
              />
            </div>
          </div>
        )}

        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </div>
  );
};

export default SubcategoryHeader;
