import { useMemo } from "react";
import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";
import type { FeedbackType } from "@src/types/Reports";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import "./FilterBar.scss";

export interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  viewMode: "flat" | "chrono" | "confirmed";
  setViewMode: (val: "flat" | "chrono" | "confirmed") => void;
  setSelectedBrand?: (brand: string, siteUrl?: string) => void; // ✅ supporte siteUrl
  setSelectedCategory?: (val: string) => void;
  setActiveFilter?: (val: string) => void;
  onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;
  options: FilterOption[];
  withBrands?: boolean;
  availableBrands?: (string | { brand: string; siteUrl?: string })[];
  selectedBrand?: string;
  labelOverride?: string;
  locationInfo?: string | null;
  brandFocusFilter?: string;
  baseFilterValue?: string;
  siteUrl?: string;
  selectedTheme?: FeedbackType;
  onThemeChange?: (theme: FeedbackType) => void;
}

const themeOptions: SelectFilterOption<FeedbackType>[] = [
  {
    value: "report",
    iconUrl: reportYellowIcon,
    iconAlt: "Signalements",
    iconFallback: "S",
    label: "Signalements",
  },
  {
    value: "coupdecoeur",
    iconUrl: likeRedIcon,
    iconAlt: "Coups de cœur",
    iconFallback: "C",
    label: "Coups de cœur",
  },
  {
    value: "suggestion",
    iconUrl: suggestGreenIcon,
    iconAlt: "Suggestions",
    iconFallback: "I",
    label: "Suggestions",
  },
];

const splitLeadingEmoji = (label: string) => {
  const trimmed = label.trim();
  if (!trimmed) return { emoji: "", text: "" };

  const [firstToken, ...rest] = trimmed.split(/\s+/);
  const hasAlphaNumeric = /[0-9A-Za-z]/.test(firstToken);
  if (!hasAlphaNumeric && rest.length > 0)
    return { emoji: firstToken, text: rest.join(" ") };
  return { emoji: "", text: trimmed };
};

const normalizeBrandName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const brandInitials = (label: string) => {
  const parts = label.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
  return (initials || label.slice(0, 2)).toUpperCase();
};

type BrandEntry = { value: string; label: string; siteUrl?: string };

export const FilterBarGeneric: React.FC<Props> = ({
  filter,
  setFilter,
  setViewMode,
  setSelectedBrand = () => {},
  setSelectedCategory = () => {},
  setActiveFilter = () => {},
  onViewModeChange,
  options,
  withBrands = false,
  availableBrands = [],
  selectedBrand = "",
  locationInfo = null,
  brandFocusFilter = "",
  baseFilterValue,
  selectedTheme = "report",
  onThemeChange = () => {},
}) => {
  const selectOptions = useMemo<SelectFilterOption[]>(() => {
    return options.map((opt) => {
      const { emoji, text } = splitLeadingEmoji(opt.label);
      return {
        value: opt.value,
        label: text || opt.label,
        emoji: emoji || undefined,
      };
    });
  }, [options]);

  const resolvedFilterValue = useMemo(() => {
    const valueExists = selectOptions.some((opt) => opt.value === filter);
    if (valueExists) return filter;

    if (
      baseFilterValue &&
      selectOptions.some((opt) => opt.value === baseFilterValue)
    ) {
      return baseFilterValue;
    }

    return selectOptions[0]?.value ?? "";
  }, [selectOptions, filter, baseFilterValue]);

  const { brandEntries, brandSiteUrlMap } = useMemo(() => {
    const canonicalMap = new Map<string, BrandEntry>();

    availableBrands.forEach((entry) => {
      const brandName =
        typeof entry === "string" ? entry : (entry?.brand ?? "");
      if (!brandName.trim()) return;
      const normalized = normalizeBrandName(brandName);
      const nextEntry: BrandEntry = {
        value: brandName,
        label: brandName,
        siteUrl: typeof entry === "object" ? entry.siteUrl : undefined,
      };

      if (!canonicalMap.has(normalized)) {
        canonicalMap.set(normalized, nextEntry);
      } else if (
        typeof entry === "object" &&
        entry.siteUrl &&
        !canonicalMap.get(normalized)?.siteUrl
      ) {
        const existing = canonicalMap.get(normalized);
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
      label: "Choisir une marque",
    };
    const decorated = brandEntries.map((entry) => {
      return {
        value: entry.value,
        label: entry.label,
        iconAlt: entry.label,
        iconFallback: brandInitials(entry.label),
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

  const brandFilterValue = useMemo(() => {
    if (brandFocusFilter) return brandFocusFilter;
    return selectOptions[0]?.value ?? "";
  }, [brandFocusFilter, selectOptions]);

  const fallbackFilterValue = useMemo(() => {
    if (baseFilterValue) return baseFilterValue;
    const alternative = selectOptions.find(
      (opt) => opt.value !== brandFilterValue,
    );
    return alternative?.value ?? selectOptions[0]?.value ?? "";
  }, [baseFilterValue, selectOptions, brandFilterValue]);

  const handleFilterChange = (value: string) => {
    setSelectedBrand("");
    setSelectedCategory?.("");
    setFilter(value);
    setActiveFilter?.(value);
    setViewMode("chrono");
    onViewModeChange?.("chrono");
  };

  const handleBrandChange = (brand: string, brandSiteUrl?: string) => {
    setSelectedBrand(brand, brandSiteUrl);
    setSelectedCategory("");

    if (brand) {
      setFilter(brandFilterValue);
      setActiveFilter(brandFilterValue);
      setViewMode("flat");
      onViewModeChange?.("flat");
    } else {
      setFilter(fallbackFilterValue);
      setActiveFilter(fallbackFilterValue);
      setViewMode("chrono");
      onViewModeChange?.("chrono");
    }
  };

  const handleBrandSelectChange = (value: string) => {
    if (!value) {
      handleBrandChange("");
      return;
    }

    const siteUrl = brandSiteUrlMap.get(value);
    handleBrandChange(value, siteUrl);
  };

  const handleThemeChange = (theme: FeedbackType) => {
    if (theme === selectedTheme) return;
    onThemeChange(theme);
  };

  return (
    <div className="filter-bar-generic-container">
      <div className="filter-bar-generic-primary">
        <Champs
          options={themeOptions}
          value={selectedTheme}
          onChange={handleThemeChange}
          align="left"
          minWidth={170}
          minWidthPart="2"
        />
      </div>

      <div className="filter-bar-generic-actions">
        <Champs
          options={selectOptions}
          value={resolvedFilterValue}
          onChange={handleFilterChange}
          activeClassName="hot-active"
          className={locationInfo === "cdc" ? "cdc-style" : ""}
          align="left"
        />

        {/* 🔹 Sélecteur de marque */}
        {withBrands && (
          <Champs
            options={brandOptions}
            value={resolvedBrandValue}
            onChange={handleBrandSelectChange}
            className="brand-select-inline"
            disabled={!brandEntries.length}
            brandSelect={true}
            minWidth={190}
            minWidthPart="2"
            align="left"
          />
        )}
      </div>
    </div>
  );
};

export default FilterBarGeneric;
