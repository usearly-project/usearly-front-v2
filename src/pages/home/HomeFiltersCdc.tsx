import { useState, useMemo } from "react";
import type { FeedbackType } from "@src/types/Reports";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import { useBrands } from "@src/hooks/useBrands"; // ✅ on réutilise ton hook existant
import "./HomeFiltersCdc.scss";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string, siteUrl?: string) => void; // ✅ garde siteUrl
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availableCategories: string[];
  siteUrl?: string;
  setSelectedSiteUrl?: (val?: string) => void;
  onThemeChange?: (theme: FeedbackType) => void;
}

const HomeFiltersCdc = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
  /*  selectedCategory, */
  setSelectedCategory,
  /* availableCategories, */
  siteUrl,
  setSelectedSiteUrl,
  onThemeChange,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">(
    "flat",
  );
  // ✅ récupération dynamique des marques depuis useBrands
  const { brands, loading } = useBrands("coupdecoeur");

  const availableBrands = useMemo(
    () => brands.map((b) => ({ brand: b.marque, siteUrl: b.siteUrl })),
    [brands],
  );

  const baseOptions = useMemo(
    () => [
      { value: "popular", label: "👍 Coups de cœur populaires" },
      { value: "enflammes", label: "❤️‍🔥 Coups de cœur les plus enflammés" },
      { value: "chrono", label: "💌 Coups de cœur les plus récents" },
    ],
    [],
  );

  const handleBrandSelect = (brand: string, brandSiteUrl?: string) => {
    setSelectedBrand(brand, brandSiteUrl);
    setSelectedCategory("");
    setFilter(brand ? "brandSolo" : "all");
    if (setSelectedSiteUrl) setSelectedSiteUrl(brandSiteUrl);
  };

  return (
    <div className="controls">
      <FilterBarGeneric
        options={baseOptions}
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setSelectedBrand={handleBrandSelect}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        availableBrands={availableBrands}
        withBrands={!loading}
        brandFocusFilter="brandSolo"
        baseFilterValue="all"
        siteUrl={siteUrl}
        selectedTheme="coupdecoeur"
        onThemeChange={onThemeChange}
      />
    </div>
  );
};

export default HomeFiltersCdc;
