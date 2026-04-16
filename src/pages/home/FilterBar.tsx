import { useEffect, useState, useMemo } from "react";
import "./FilterBar.scss";
import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";
// import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import type { FeedbackType } from "@src/types/Reports";
import usearlyIcon from "/usearly-favicon.png";
import type { FeedFilterValue } from "@src/components/feed/types/feedFilterTypes";

interface Props {
  filter:
    | "hot"
    | "rage"
    | "popular"
    | "recent"
    | "urgent"
    | "confirmed"
    | "chrono"
    | "";
  setFilter: React.Dispatch<
    React.SetStateAction<
      | "hot"
      | "rage"
      | "popular"
      | "recent"
      | "urgent"
      | "confirmed"
      | "chrono"
      | ""
    >
  >;
  viewMode: "flat" | "chrono" | "confirmed";
  setViewMode: (val: "flat" | "chrono" | "confirmed") => void;
  setSelectedBrand: (val: string) => void;
  setSelectedCategory: (val: string) => void;
  setActiveFilter: (val: string) => void;
  onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;
  isHotFilterAvailable: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  selectedBrand: string;
  selectedCategory: string;
  selectedMainCategory?: string;
  setSelectedMainCategory?: (val: string) => void;
  availableBrands: (string | { brand: string; siteUrl?: string })[];
  availableCategories: string[];
  labelOverride?: string;
  setSelectedSiteUrl: (url?: string) => void;
  availableSubCategoriesByBrandAndCategory?: Record<
    string, // marque
    Record<string, string[]> // catégorie principale -> sous-catégories
  >;
  isFeedLoading?: boolean;
  selectedTheme?: FeedbackType;
  onThemeChange?: (theme: FeedbackType) => void;
}

type ThemeOption = FeedbackType | "all";

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[\s.]+$/g, "")
    .trim();

const normalizeBrandName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// const DEFAULT_CATEGORY_ICON = getCategoryIconPathFromSubcategory(undefined);

const FILTER_LABELS: Record<FeedFilterValue, string> = {
  all: "L'actu du moment",
  report: "Signalements",
  coupdecoeur: "Coups de cœur",
  suggestion: "Suggestions",
};
const themeOptions: SelectFilterOption<ThemeOption>[] = [
  {
    value: "all",
    iconUrl: usearlyIcon,
    iconAlt: "All feedback",
    iconFallback: "A",
    label: FILTER_LABELS.all,
  },
  {
    value: "report",
    iconUrl: reportYellowIcon,
    iconAlt: "Signalements",
    iconFallback: "S",
    label: FILTER_LABELS.report,
  },
  {
    value: "coupdecoeur",
    iconUrl: likeRedIcon,
    iconAlt: "Coups de cœur",
    iconFallback: "C",
    label: FILTER_LABELS.coupdecoeur,
  },
  {
    value: "suggestion",
    iconUrl: suggestGreenIcon,
    iconAlt: "Suggestions",
    iconFallback: "I",
    label: FILTER_LABELS.suggestion,
  },
];

const filterOptions = [
  {
    value: "hot" as const,
    emoji: "🔥",
    label: "Les plus signalés",
  },
  {
    value: "rage" as const,
    emoji: "😡",
    label: "Les plus rageants",
  },
  {
    value: "popular" as const,
    emoji: "👍",
    label: "Les plus populaires",
  },
  {
    value: "chrono" as const,
    emoji: "📅",
    label: "Les plus récents",
  },
];

type FilterOptionValue = (typeof filterOptions)[number]["value"];

const FilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  /* viewMode, */
  setViewMode,
  setSelectedBrand,
  setSelectedCategory,
  setActiveFilter,
  onViewModeChange,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedBrand,
  selectedCategory,
  selectedMainCategory: externalSelectedMainCategory,
  setSelectedMainCategory: externalSetSelectedMainCategory,
  availableBrands,
  availableCategories,
  setSelectedSiteUrl,
  // availableSubCategoriesByBrandAndCategory,
  isFeedLoading = false,
  selectedTheme = "report",
  onThemeChange = () => {},
}) => {
  const [categorySearch, setCategorySearch] = useState("");
  const [disableBrandOnce, setDisableBrandOnce] = useState(true);

  const normalizedSelectValue = useMemo<FilterOptionValue>(() => {
    if (filter === "confirmed" || filter === "") {
      return "hot";
    }

    if (filter === "recent") {
      return "chrono";
    }

    if (filterOptions.some((option) => option.value === filter)) {
      return filter as FilterOptionValue;
    }

    return "hot";
  }, [filter]);

  const normalizedCategories = useMemo(() => {
    if (!categorySearch.trim()) return availableCategories;
    const query = normalize(categorySearch);
    return availableCategories.filter((cat) => normalize(cat).includes(query));
  }, [availableCategories, categorySearch]);
  const signalementOptions = useMemo(
    () => [
      { value: "" as const, label: "Type de signalements" },
      ...normalizedCategories.map((cat) => ({ value: cat, label: cat })),
    ],
    [normalizedCategories],
  );
  const hasSignalementOptions = signalementOptions.length > 0;

  // const filtersDisabled = Boolean(isFeedLoading);

  const [internalSelectedMainCategory, setInternalSelectedMainCategory] =
    useState("");

  const selectedMainCategory =
    externalSelectedMainCategory ?? internalSelectedMainCategory;

  const setSelectedMainCategory =
    externalSetSelectedMainCategory ?? setInternalSelectedMainCategory;

  type BrandEntry = {
    value: string;
    label: string;
    siteUrl?: string;
  };

  const { brandEntries, brandSiteUrlMap } = useMemo(() => {
    const canonicalMap = new Map<string, BrandEntry>();

    availableBrands.forEach((entry) => {
      const brandName =
        typeof entry === "string" ? entry : (entry?.brand ?? "");
      if (!brandName.trim()) return;
      const normalizedKey = normalizeBrandName(brandName);
      const nextEntry: BrandEntry = {
        value: brandName,
        label: brandName,
        siteUrl: typeof entry === "object" ? entry.siteUrl : undefined,
      };

      if (!canonicalMap.has(normalizedKey)) {
        canonicalMap.set(normalizedKey, nextEntry);
      } else if (
        typeof entry === "object" &&
        entry.siteUrl &&
        !canonicalMap.get(normalizedKey)?.siteUrl
      ) {
        const existing = canonicalMap.get(normalizedKey);
        if (existing) existing.siteUrl = entry.siteUrl;
      }
    });

    const sorted = Array.from(canonicalMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "fr", { sensitivity: "base" }),
    );

    const siteUrlMap = new Map<string, string | undefined>();
    sorted.forEach(({ value, siteUrl }) => {
      siteUrlMap.set(value, siteUrl);
    });

    return { brandEntries: sorted, brandSiteUrlMap: siteUrlMap };
  }, [availableBrands]);

  const brandOptions = useMemo<SelectFilterOption[]>(() => {
    const placeholder: SelectFilterOption = {
      value: "",
      label: "Marques",
    };
    const decorated = brandEntries.map((entry) => {
      return {
        value: entry.value,
        label: entry.label,
        iconAlt: entry.label,
        iconFallback: entry.label,
        siteUrl: entry.siteUrl,
      };
    });
    return [placeholder, ...decorated];
  }, [brandEntries]);

  const resolvedBrandValue = useMemo(() => {
    if (!selectedBrand) return "";
    const normalizedSelected = normalizeBrandName(selectedBrand);
    const found = brandOptions.find(
      (opt) =>
        Boolean(opt.value) &&
        normalizeBrandName(opt.value) === normalizedSelected,
    );
    return found?.value ?? "";
  }, [brandOptions, selectedBrand]);
  // const subCategoryOptions = useMemo<SelectFilterOption[]>(() => {
  //   const placeholder: SelectFilterOption = {
  //     value: "",
  //     label: "Sous-catégorie",
  //     iconUrl: DEFAULT_CATEGORY_ICON,
  //     iconAlt: "Sous-catégorie",
  //     iconFallback: "SC",
  //   };

  //   if (!selectedBrand || !selectedMainCategory) {
  //     return [placeholder];
  //   }

  //   const subCategories =
  //     availableSubCategoriesByBrandAndCategory?.[selectedBrand]?.[
  //       selectedMainCategory
  //     ] || [];

  //   if (!subCategories.length) {
  //     return [placeholder];
  //   }

  //   return [
  //     placeholder,
  //     ...subCategories.map((sub) => ({
  //       value: sub,
  //       label: sub,
  //       iconUrl: getCategoryIconPathFromSubcategory(sub),
  //       iconAlt: sub,
  //       iconFallback: sub,
  //     })),
  //   ];
  // }, [
  //   availableSubCategoriesByBrandAndCategory,
  //   selectedBrand,
  //   selectedMainCategory,
  // ]);

  // const mainCategoryOptions = useMemo<SelectFilterOption[]>(() => {
  //   const placeholder: SelectFilterOption = {
  //     value: "",
  //     label: "Catégorie principale",
  //     iconUrl: DEFAULT_CATEGORY_ICON,
  //     iconAlt: "Catégorie principale",
  //     iconFallback: "CP",
  //   };

  //   if (!selectedBrand) {
  //     return [placeholder];
  //   }

  //   const categories = Object.keys(
  //     availableSubCategoriesByBrandAndCategory?.[selectedBrand] ?? {},
  //   );

  //   if (!categories.length) {
  //     return [placeholder];
  //   }

  //   return [
  //     placeholder,
  //     ...categories.map((cat) => ({
  //       value: cat,
  //       label: cat,
  //       iconUrl: getCategoryIconPathFromSubcategory(cat),
  //       iconAlt: cat,
  //       iconFallback: cat,
  //     })),
  //   ];
  // }, [availableSubCategoriesByBrandAndCategory, selectedBrand]);

  const resetBrandFilters = () => {
    if (selectedBrand) {
      setSelectedBrand("");
    }
    if (selectedCategory) {
      setSelectedCategory("");
    }
    if (selectedMainCategory) {
      setSelectedMainCategory("");
    }
    setCategorySearch("");
  };

  const handleFilterSelect = (value: FilterOptionValue) => {
    resetBrandFilters();

    if (value === "chrono") {
      setFilter("chrono");
      setViewMode("chrono");
      onViewModeChange?.("chrono");
      setActiveFilter("chrono");
    } else if (value === "hot") {
      setFilter("hot");
      setViewMode("confirmed");
      onViewModeChange?.("confirmed");
      setActiveFilter("confirmed");
    } else if (["rage", "popular"].includes(value)) {
      setFilter(value);
      setViewMode("chrono");
      onViewModeChange?.("chrono");
      setActiveFilter(value);
    } else {
      setFilter("");
      setViewMode("flat");
      onViewModeChange?.("flat");
      setActiveFilter("");
    }
  };

  // const handleCategorySelect = (category: string) => {
  //   setSelectedCategory(category);
  //   setViewMode("flat");
  //   setFilter("");
  //   onViewModeChange?.("flat");
  //   setActiveFilter("");
  // };

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen, dropdownRef]);

  useEffect(() => {
    // Quand la marque change → reset des catégories
    setSelectedMainCategory("");
    setSelectedCategory("");
  }, [selectedBrand, setSelectedMainCategory, setSelectedCategory]);

  const handleBrandSelect = (brand: string, siteUrl?: string): void => {
    const normalized = brand.trim();
    setSelectedBrand(normalized);

    // ✅ Si siteUrl est vide, on tente de le retrouver depuis availableBrands
    if (siteUrl) {
      setSelectedSiteUrl(siteUrl);
    } else {
      const matched = availableBrands.find((b) => {
        if (typeof b === "object") return b.brand === brand;
        return false;
      }) as { brand: string; siteUrl?: string } | undefined;

      setSelectedSiteUrl(matched?.siteUrl || "");
    }

    console.log("✅ handleBrandSelect →", { brand, siteUrl });

    // 🧹 Réinitialise les filtres liés à la marque précédente
    setSelectedMainCategory("");
    setSelectedCategory("");

    setViewMode("flat");
    setFilter("");
    onViewModeChange?.("flat");
    setActiveFilter("");
  };

  const clearBrand = () => {
    resetBrandFilters();
    setViewMode("chrono");
    setFilter("chrono");
    onViewModeChange?.("chrono");
    setActiveFilter("chrono");
  };

  const handleBrandSelectChange = (value: string) => {
    if (!value) {
      clearBrand();
      return;
    }

    const siteUrl = brandSiteUrlMap.get(value);
    handleBrandSelect(value, siteUrl);
  };

  const handleThemeSelect = (theme: ThemeOption) => {
    if (theme === "all") {
      window.location.href = "/";
      return;
    }

    if (theme === selectedTheme) return;
    onThemeChange(theme);
  };

  useEffect(() => {
    if (disableBrandOnce && !isFeedLoading) {
      setDisableBrandOnce(false);
    }
  }, [isFeedLoading, disableBrandOnce]);

  if (!selectedBrand) {
    return (
      <div
        className="filter-container"
        data-has-category-options={hasSignalementOptions}
      >
        <div className="primary-filters">
          <Champs
            options={
              themeOptions as unknown as SelectFilterOption<FeedbackType>[]
            }
            value={selectedTheme}
            onChange={handleThemeSelect}
            align="left"
            minWidthPart="2"
            minWidth={170}
            fitWidthToOptions
          />
        </div>
        <div className="secondary-filters-container">
          <Champs
            options={filterOptions}
            value={normalizedSelectValue}
            onChange={handleFilterSelect}
            activeOnValue="hot"
            activeClassName="hot-active"
            align="left"
            minWidthPart="2"
            minWidth={235}
          />
          <Champs
            options={brandOptions}
            value={resolvedBrandValue}
            onChange={handleBrandSelectChange}
            className="brand-select-inline"
            disabled={disableBrandOnce}
            brandSelect={true}
            minWidth={190}
            minWidthPart="2"
            align="left"
            loading={Boolean(isFeedLoading)}
          />
        </div>
      </div>
    );
  } else if (selectedBrand) {
    return (
      <div
        className="filters filters--brand-selected"
        data-has-category-options={hasSignalementOptions}
      >
        <div className="filters__row">
          {/* Pill 0 : Type de feedback, gardé visible même avec une marque */}
          <div className="filters__pill filters__pill--theme">
            <Champs
              options={
                themeOptions as unknown as SelectFilterOption<FeedbackType>[]
              }
              value={selectedTheme}
              onChange={handleThemeSelect}
              className="pill__control"
              align="left"
              minWidthPart="2"
              minWidth={170}
              fitWidthToOptions
            />
          </div>

          {/* Pill 1 : Marque (toujours visible) */}
          <div className="filters__pill filters__pill--brand">
            <Champs
              options={brandOptions}
              value={resolvedBrandValue}
              onChange={handleBrandSelectChange}
              className="pill__control"
              brandSelect={true}
              minWidth={225}
              minWidthPart="2"
              align="left"
              loading={Boolean(isFeedLoading)}
            />
          </div>

          {/* Catégories temporairement masquées quand une marque est sélectionnée.
          {selectedBrand && (
            <div className="filters__pill filters__pill--maincat">
              <Champs
                options={mainCategoryOptions}
                value={selectedMainCategory || ""}
                onChange={(cat) => {
                  setSelectedMainCategory(cat);
                  setSelectedCategory("");
                  setViewMode("flat");
                  setFilter("");
                  onViewModeChange?.("flat");
                  setActiveFilter("");
                }}
                className="pill__select"
                variant="grid"
                disabled={filtersDisabled}
                placeholderResetLabel="Réinitialiser"
                loading={filtersDisabled}
              />
            </div>
          )}

          {selectedBrand && selectedMainCategory && (
            <div className="filters__pill filters__pill--subcat">
              <Champs
                options={subCategoryOptions}
                value={selectedCategory}
                onChange={handleCategorySelect}
                className="pill__select"
                variant="grid"
                disabled={filtersDisabled}
                placeholderResetLabel="Réinitialiser"
                loading={filtersDisabled}
              />
            </div>
          )} */}
        </div>
      </div>
    );
  }
  return null;
};

export default FilterBar;
