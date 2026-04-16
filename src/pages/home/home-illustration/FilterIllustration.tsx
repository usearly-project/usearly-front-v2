import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsBigUtils";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import "./FilterIllustration.scss";
import {
  getFilterIllustrationContent,
  normalizeFilterIllustrationKey,
  type FilterIllustrationTabKey,
} from "./filterIllustrationContent";
import {
  illustrationMap,
  illustrationMapWithText,
  getBrandSoloIllustration,
} from "./filterIllustrationAssets";
import {
  buildFilteredSidebarClassName,
  EMPTY_BRAND_REPORT_STATS,
  getBrandLogoKeys,
} from "./filterIllustrationBrand";
import {
  BrandIllustrationCard,
  CategoryIconIllustration,
  DefaultIllustrationCard,
} from "./FilterIllustrationCards";
import type { BrandReportStats } from "../home-grouped-reports-list/utils/brandReportStats";

export type FilterIllustrationProps = {
  filter: string;
  selectedBrand?: string;
  selectedCategory?: string;
  siteUrl?: string;
  onglet?: FilterIllustrationTabKey;
  withText?: boolean;
  containerStyle?: CSSProperties;
  brandReportStats?: BrandReportStats | null;
};

const FilterIllustration = ({
  filter,
  selectedBrand,
  selectedCategory,
  siteUrl,
  onglet = "report",
  withText = false,
  containerStyle,
  brandReportStats,
}: FilterIllustrationProps) => {
  const isBrandFocused = Boolean(selectedBrand || selectedCategory);
  const brandEntries = useMemo(
    () => (selectedBrand ? [{ brand: selectedBrand, siteUrl }] : []),
    [selectedBrand, siteUrl],
  );
  const brandLogos = useBrandLogos(brandEntries);
  const brandLogoKeys = useMemo(
    () => (selectedBrand ? getBrandLogoKeys(selectedBrand, siteUrl) : []),
    [selectedBrand, siteUrl],
  );

  const logoUrl = useMemo(() => {
    if (!selectedBrand || !brandLogos) return null;

    for (const brandLogoKey of brandLogoKeys) {
      if (brandLogos[brandLogoKey]) {
        return brandLogos[brandLogoKey];
      }
    }

    return null;
  }, [selectedBrand, brandLogos, brandLogoKeys]);

  useEffect(() => {
    console.log("🧩 FilterIllustration props:", {
      selectedBrand,
      siteUrl,
      onglet,
      withText,
    });
  }, [selectedBrand, siteUrl, onglet, withText]);

  const activeIllustrationMap = withText
    ? illustrationMapWithText
    : illustrationMap;

  const shouldShowCategoryIcon =
    onglet === "report" && !!selectedBrand && !!selectedCategory;

  const categoryIcon = useMemo(() => {
    if (!shouldShowCategoryIcon) return null;

    return getCategoryIconPathFromSubcategory(
      selectedCategory,
      selectedBrand,
      onglet,
    );
  }, [selectedCategory, selectedBrand, shouldShowCategoryIcon, onglet]);

  const brandSoloImg = useMemo(
    () => getBrandSoloIllustration(selectedBrand, onglet),
    [selectedBrand, onglet],
  );
  const listKey = useMemo(
    () => normalizeFilterIllustrationKey(filter, onglet),
    [filter, onglet],
  );
  const { content } = getFilterIllustrationContent(filter, onglet);

  if (isBrandFocused) {
    const shouldShowCategoryOnly = Boolean(
      shouldShowCategoryIcon && categoryIcon,
    );
    const shouldShowSelectedBrandTitle =
      onglet === "report" && !!selectedBrand && !selectedCategory;
    const shouldShowBrandStats =
      shouldShowSelectedBrandTitle && brandReportStats != null;
    const containerClassName = buildFilteredSidebarClassName({
      hasBrandSoloIllustration: Boolean(brandSoloImg),
      shouldShowCategoryOnly,
      shouldShowSelectedBrandTitle,
    });

    if (shouldShowCategoryOnly && categoryIcon) {
      return (
        <CategoryIconIllustration
          categoryIcon={categoryIcon}
          selectedCategory={selectedCategory}
          containerClassName={containerClassName}
        />
      );
    }

    return (
      <BrandIllustrationCard
        brandName={capitalizeFirstLetter(selectedBrand)}
        logoUrl={logoUrl}
        siteUrl={siteUrl}
        selectedBrand={selectedBrand}
        containerClassName={containerClassName}
        containerStyle={containerStyle}
        shouldShowSelectedBrandTitle={shouldShowSelectedBrandTitle}
        shouldShowBrandStats={shouldShowBrandStats}
        brandReportStats={brandReportStats ?? EMPTY_BRAND_REPORT_STATS}
      />
    );
  }

  return (
    <DefaultIllustrationCard
      img={activeIllustrationMap[listKey]}
      alt={content.title}
    />
  );
};

export default FilterIllustration;
