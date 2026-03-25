import BrandResponseBanner from "@src/components/brand-response-banner/BrandResponseBanner";
import type { UserGroupedReport } from "@src/types/Reports";

interface Props {
  sub: UserGroupedReport;
  initialDescription: UserGroupedReport["descriptions"][number];
  brand: string;
  siteUrl: string;
  showFullText: Record<string, boolean>;
  setShowFullText: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  setModalImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const MainDescription: React.FC<Props> = ({
  sub,
  initialDescription,
  brand,
  siteUrl,
  showFullText,
  setShowFullText,
  setModalImage,
}) => {
  const isExpanded = showFullText[sub.subCategory];

  return (
    <>
      <div className="main-description">
        <p className="description-text">
          {isExpanded
            ? `${initialDescription.description} ${
                initialDescription.emoji || ""
              }`
            : `${initialDescription.description.slice(0, 100)}${
                initialDescription.description.length > 100 ? "…" : ""
              }`}

          {(initialDescription.description.length > 100 ||
            initialDescription.capture) && (
            <button
              className="see-more-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullText((prev) => ({
                  ...prev,
                  [sub.subCategory]: !prev[sub.subCategory],
                }));
              }}
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </p>

        {isExpanded && initialDescription.capture && (
          <img
            src={initialDescription.capture}
            className="inline-capture-img"
            onClick={(e) => {
              e.stopPropagation();
              setModalImage(initialDescription.capture);
            }}
          />
        )}
      </div>

      {sub.hasBrandResponse && typeof sub.hasBrandResponse === "object" && (
        <BrandResponseBanner
          message={
            sub.hasBrandResponse.message ||
            sub.hasBrandResponse.content ||
            sub.hasBrandResponse.response ||
            ""
          }
          createdAt={sub.hasBrandResponse.createdAt}
          brand={brand}
          brandSiteUrl={siteUrl}
          brandResponse={sub.hasBrandResponse}
        />
      )}
    </>
  );
};

export default MainDescription;
