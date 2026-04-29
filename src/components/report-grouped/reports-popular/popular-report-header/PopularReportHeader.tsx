import { useLayoutEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { compactRelativeDateLabel } from "@src/utils/dateUtils";

interface Props {
  item: any;
  isOpen: boolean;
  author: any;
  brandLogo: string;
  formattedShortDate: string;
  firstDescription: any;
  onDescriptionMarginChange?: (marginLeft: number) => void;
}

const PopularReportHeader: React.FC<Props> = ({
  item,
  isOpen,
  author,
  brandLogo,
  formattedShortDate,
  firstDescription,
  onDescriptionMarginChange,
}) => {
  const iconRef = useRef<HTMLImageElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const recomputeMargin = () => {
    const icon = iconRef.current;
    const left = leftRef.current;
    if (!icon || !left || !onDescriptionMarginChange) return;
    const iconWidth = icon.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(left).columnGap) || 0;
    onDescriptionMarginChange(iconWidth + gap);
  };

  useLayoutEffect(() => {
    recomputeMargin();
    const icon = iconRef.current;
    const left = leftRef.current;
    if (!icon || !left) return;
    const ro = new ResizeObserver(recomputeMargin);
    ro.observe(icon);
    ro.observe(left);
    return () => ro.disconnect();
  }, [item.subCategory, isOpen]);

  return (
    <div className="subcategory-header">
      <div className="subcategory-left" ref={leftRef}>
        <img
          ref={iconRef}
          src={getCategoryIconPathFromSubcategory(item.subCategory)}
          alt={item.subCategory}
          className="subcategory-icon"
          onLoad={recomputeMargin}
        />
        <div className="subcategory-text">
          <div className="subcategory-title-row">
            <h4>{item.subCategory || "Signalement"}</h4>
            {formattedShortDate && (
              <span className="date-badge">⸱ {formattedShortDate}</span>
            )}
          </div>
        </div>
      </div>

      <div className="subcategory-right">
        {isOpen ? (
          <div className="expanded-header">
            <div className="avatar-logo-group">
              <Avatar
                avatar={author.avatar}
                pseudo={author.pseudo}
                type="user"
              />
              <Avatar avatar={brandLogo} pseudo={item.marque} type="brand" />
            </div>
            <UserBrandLine
              userId={author.id}
              email={author?.email}
              pseudo={author.pseudo}
              brand={item.marque}
              type="report"
            />
          </div>
        ) : (
          <div className="collapsed-header">
            <span className="date-subcategory">
              {compactRelativeDateLabel(
                formatDistanceToNow(new Date(firstDescription.createdAt), {
                  locale: fr,
                  addSuffix: true,
                }),
              )}
            </span>
            <Avatar avatar={brandLogo} pseudo={item.marque} type="brand" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularReportHeader;
