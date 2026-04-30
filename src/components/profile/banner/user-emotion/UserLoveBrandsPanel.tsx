import "./UserLoveBrandsPanel.scss";
import Avatar from "@src/components/shared/Avatar";

type BrandStat = {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  count: number;
};

type SolutionStat = {
  id: string;
  title: string;
  brand: string;
  siteUrl?: string;
  logo?: string | null;
  solutionsCount: number;
};

interface Props {
  brands: BrandStat[];
  title?: string;
  solutions?: SolutionStat[];
}

export default function UserLoveBrandsPanel({
  brands,
  title = "Mes love brands",
  solutions = [],
}: Props) {
  const hasBrands = brands && brands.length > 0;
  const hasSolutions = solutions.length > 0;

  if (!hasBrands && !hasSolutions) return null;

  return (
    <div className="love-brands-card">
      {hasBrands && (
        <>
          <h4 className="love-brands-title">{title}</h4>

          <div className="love-brands-list">
            {brands.map((brand) => (
              <div key={brand.id} className="love-brand-tooltip">
                <Avatar
                  avatar={brand.logo}
                  pseudo={brand.name}
                  siteUrl={brand.domain}
                  type="brand"
                  sizeHW={32}
                  preferBrandLogo
                />

                {/* TOOLTIP */}
                <div className="love-brand-tooltip-content">
                  <strong>{brand.name}</strong>
                  <span>{brand.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {hasSolutions && (
        <div className="user-report-solutions">
          {hasBrands && <div className="love-brands-divider" />}

          <h4 className="love-brands-title">Solutions</h4>

          <div className="user-report-solutions-list">
            {solutions.map((solution) => {
              const solutionsLabel =
                solution.solutionsCount === 1 ? "solution" : "solutions";

              return (
                <div key={solution.id} className="user-report-solution-item">
                  <Avatar
                    avatar={solution.logo ?? null}
                    pseudo={solution.brand}
                    siteUrl={solution.siteUrl}
                    type="brand"
                    sizeHW={28}
                    preferBrandLogo
                  />

                  <div className="user-report-solution-copy">
                    <span className="user-report-solution-title">
                      {solution.title}
                    </span>
                    <span className="user-report-solution-count">
                      {solution.solutionsCount} {solutionsLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
