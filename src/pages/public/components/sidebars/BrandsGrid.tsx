import Avatar from "@src/components/shared/Avatar";

type BrandStat = {
  brandName: string;
  siteUrl: string;
  count: number;
};

interface Props {
  brands: BrandStat[];
}

const BrandsGrid = ({ brands }: Props) => (
  <div className="brands-grid">
    {brands.length === 0 ? (
      <p className="empty">Aucune marque pour le moment</p>
    ) : (
      brands.map((brand) => (
        <div key={brand.siteUrl || brand.brandName} className="brand-grid-item">
          <Avatar
            avatar={null}
            pseudo={brand.brandName}
            siteUrl={brand.siteUrl}
            type="brand"
            sizeHW={40}
          />
          <span className="brand-grid-count">{brand.count}</span>
        </div>
      ))
    )}
  </div>
);

export default BrandsGrid;
