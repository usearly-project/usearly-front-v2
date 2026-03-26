import { useState, useMemo } from "react";
import type { FeedbackType } from "@src/types/Reports";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import { useBrands } from "@src/hooks/useBrands";
import "./HomeFiltersSuggestion.scss";
// import { CiSearch } from "react-icons/ci";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string, siteUrl?: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availableCategories: string[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  siteUrl?: string;
  onThemeChange?: (theme: FeedbackType) => void;
}

const HomeFiltersSuggestion = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
  /* selectedCategory, */
  setSelectedCategory,
  /* availableCategories, */
  // searchQuery,
  onSearchChange,
  siteUrl,
  onThemeChange,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">(
    "flat",
  );
  // ✅ hook partagé avec reports et CDC
  const { brands, loading } = useBrands("suggestion");
  const availableBrands = useMemo(
    () => brands.map((b) => ({ brand: b.marque, siteUrl: b.siteUrl })),
    [brands],
  );

  const baseOptions = useMemo(
    () => [
      { value: "allSuggest", label: "👍️ Suggestions populaires" },
      { value: "recentSuggestion", label: "🪄 Suggestions ouvertes aux votes" },
      { value: "likedSuggestion", label: "🙌 Suggestions adoptées" },
    ],
    [],
  );

  const handleBrandSelect = (brand: string, brandSiteUrl?: string) => {
    setSelectedBrand(brand, brandSiteUrl);
    setSelectedCategory("");
    setFilter(brand ? "brandSolo" : "allSuggest");
    if (!brand) onSearchChange("");
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
        baseFilterValue="allSuggest"
        siteUrl={siteUrl}
        selectedTheme="suggestion"
        onThemeChange={onThemeChange}
      />

      {/* {selectedBrand && (
        <div className="suggestion-search">
          <CiSearch />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par titre, contenu ou marque"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => onSearchChange("")}
            >
              Effacer
            </button>
          )}
        </div>
      )} */}
    </div>
  );
};

export default HomeFiltersSuggestion;
