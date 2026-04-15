import Avatar from "@src/components/shared/Avatar";
import type { BrandReportStats } from "../home-grouped-reports-list/utils/brandReportStats";
import arrowRight from "/assets/icons/arrow-right.svg";
import lightBulbNoLight from "/assets/icons/solution-icon-light.svg";

const brandStatsNumberFormatter = new Intl.NumberFormat("fr-FR");

const BrandStatsSection = ({ stats }: { stats: BrandReportStats }) => (
  <div className="filter-illustration-sidebar__brand-stats">
    {/* <div className="filter-illustration-sidebar__brand-stat">
      <span
        aria-hidden="true"
        className="filter-illustration-sidebar__brand-stat-arrow"
      >
        →
      </span>
      <div className="filter-illustration-sidebar__brand-stat-content">
        <strong className="filter-illustration-sidebar__brand-stat-value">
          {brandStatsNumberFormatter.format(stats.problemsCount)}
        </strong>
        <span className="filter-illustration-sidebar__brand-stat-label">
          {stats.problemsCount > 1 ? "problèmes" : "problème"}
        </span>
      </div>
    </div> */}

    <div className="filter-illustration-sidebar__brand-stat">
      <span
        aria-hidden="true"
        className="filter-illustration-sidebar__brand-stat-arrow"
      >
        <img src={arrowRight} alt="" />
      </span>
      <div className="filter-illustration-sidebar__brand-stat-content">
        <strong className="filter-illustration-sidebar__brand-stat-value">
          {brandStatsNumberFormatter.format(stats.impactedUsersCount)}
        </strong>
        <span className="filter-illustration-sidebar__brand-stat-label">
          {stats.impactedUsersCount > 1
            ? "utilisateurs impactés"
            : "utilisateur impacté"}
        </span>
      </div>
    </div>

    <div className="filter-illustration-sidebar__brand-stat">
      <span
        aria-hidden="true"
        className="filter-illustration-sidebar__brand-stat-arrow"
      >
        <img src={arrowRight} alt="" />
      </span>
      <div className="filter-illustration-sidebar__brand-stat-content">
        <strong className="filter-illustration-sidebar__brand-stat-value">
          {brandStatsNumberFormatter.format(stats.solutionsCount)}
          <img src={lightBulbNoLight} width={29} height={29} alt="" />
        </strong>
        <span className="filter-illustration-sidebar__brand-stat-label">
          {stats.solutionsCount > 1 ? "solutions" : "solution"}
        </span>
      </div>
    </div>
  </div>
);

export const CategoryIconIllustration = ({
  categoryIcon,
  selectedCategory,
  containerClassName,
}: {
  categoryIcon: string;
  selectedCategory?: string;
  containerClassName: string;
}) => (
  <div className={containerClassName}>
    <div className="illustration-content category-icon-container">
      <div className="category-icon-wrapper">
        <img
          src={categoryIcon}
          alt={selectedCategory || "Catégorie"}
          className="category-icon"
        />
      </div>
    </div>
  </div>
);

export const BrandIllustrationCard = ({
  brandName,
  logoUrl,
  siteUrl,
  selectedBrand,
  containerClassName,
  shouldShowSelectedBrandTitle,
  shouldShowBrandStats,
  brandReportStats,
}: {
  brandName: string;
  logoUrl: string | null;
  siteUrl?: string;
  selectedBrand?: string;
  containerClassName: string;
  shouldShowSelectedBrandTitle: boolean;
  shouldShowBrandStats: boolean;
  brandReportStats: BrandReportStats;
}) => (
  <div className={containerClassName}>
    <div
      className={[
        "illustration-content",
        shouldShowSelectedBrandTitle
          ? "illustration-content--brand-report"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {shouldShowSelectedBrandTitle && (
        <div className="filter-illustration-sidebar__brand-copy">
          <h2 className="filter-illustration-sidebar__selected-brand-title">
            Problèmes et{"\n"}bugs{"\u00A0"}
            <span>{brandName}</span>
          </h2>
          <p className="filter-illustration-sidebar__selected-brand-description">
            Découvrez tous les problèmes que la communauté a rencontrés sur{" "}
            {brandName} et leurs solutions.
          </p>
        </div>
      )}
      <div className="filter-illustration-sidebar__brand-logo">
        <Avatar
          key={`${selectedBrand}-${siteUrl ?? ""}`}
          avatar={logoUrl}
          pseudo={selectedBrand}
          type="brand"
          siteUrl={siteUrl}
          sizeHW={100}
          preferBrandLogo
        />
      </div>
    </div>
    {shouldShowBrandStats && <BrandStatsSection stats={brandReportStats} />}
  </div>
);

export const DefaultIllustrationCard = ({
  img,
  alt,
}: {
  img: string;
  alt: string;
}) => (
  <div className="filter-illustration-sidebar">
    <div className="illustration-content">
      <img src={img} alt={alt} />
    </div>
  </div>
);
