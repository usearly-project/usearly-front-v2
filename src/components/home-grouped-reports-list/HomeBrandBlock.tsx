import { useHomeBrandBlock } from "./hooks/useHomeBrandBlock";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import type { PublicGroupedReport } from "@src/types/Reports"; // Import du type
import Avatar from "../shared/Avatar";
import SubCategoryBlock from "./SubCategoryBlock";
import "../user-reports/UserBrandBlock.scss";

interface Props {
  brand: string;
  siteUrl: string;
  reports: PublicGroupedReport[];
}

const HomeBrandBlock: React.FC<Props> = ({ brand, siteUrl, reports }) => {
  const {
    isOpen,
    toggleBrand,
    uniqueSubCategories,
    mostRecentDate,
    expandedSub,
    setExpandedSub,
    localCommentsCounts,
    brandResponsesMap,
  } = useHomeBrandBlock(brand, reports);

  return (
    <div className={`brand-block ${isOpen ? "open" : "close"}`}>
      <div className="brand-header" onClick={toggleBrand}>
        <Avatar
          avatar={null}
          pseudo={brand}
          type="brand"
          siteUrl={siteUrl}
          preferBrandLogo
        />
        <p className="brand-reports-count">
          <strong>{uniqueSubCategories.length}</strong> signalement sur{" "}
          <strong>{brand}</strong>
        </p>
        <p className="date-card">
          {mostRecentDate
            ? `Il y a ${formatDistance(mostRecentDate, new Date(), { locale: fr })}`
            : "Date inconnue"}
        </p>
      </div>

      {isOpen && (
        <div className="subcategories-list">
          {uniqueSubCategories.map((sub, index) => (
            <SubCategoryBlock
              key={sub.subCategory}
              sub={sub}
              brand={brand}
              siteUrl={siteUrl}
              index={index}
              isExpanded={expandedSub === sub.subCategory}
              onToggle={() =>
                setExpandedSub((prev) =>
                  prev === sub.subCategory ? null : sub.subCategory,
                )
              }
              commentsCounts={localCommentsCounts}
              brandResponsesMap={brandResponsesMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBrandBlock;
