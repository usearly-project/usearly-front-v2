import reportHotIcon from "/assets/img-banner/withoutText/report-rage.svg";
import reportHot2Icon from "/assets/img-banner/withoutText/report-hot.svg";
import reportPopularIcon from "/assets/img-banner/withoutText/report-popular.svg";
import reportRecentIcon from "/assets/img-banner/withoutText/report-recent.svg";
import cdcPopularIcon from "/assets/img-banner/withoutText/cdc-popular.svg";
import cdcEnflamIcon from "/assets/img-banner/withoutText/cdc-enflam.svg";
import suggestPopularIcon from "/assets/img-banner/withoutText/suggest-popular.svg";
import suggestOpenIcon from "/assets/img-banner/withoutText/suggest-open.svg";

import hotImg from "/assets/filters-reports/hot1.png";
import rageImg from "/assets/filters-reports/rage1.png";
import popularImg from "/assets/filters-reports/popular1.png";
import urgentImg from "/assets/filters-reports/carrying1.png";
import recentImg from "/assets/filters-reports/recent1.png";
import recentReportImg from "/assets/img-banner/banner-report-recent.png";

// 🎨 Coup de cœur & Suggestions
import likedImg from "/assets/img-banner/banner-cdc-pop.png";
import recentCdcImg from "/assets/img-banner/banner-cdc-recent.png";
import recentCdcIcon from "/assets/img-banner/withoutText/cdc-recent.svg";
import commentedImg from "/assets/img-banner/banner-cdc-liked.png";
import discussedImg from "/assets/img-banner/banner-suggestion-top-idea.png";
import recentSuggestionImg from "/assets/img-banner/banner-suggestion-reves.png";
import likedSuggestionImg from "/assets/img-banner/banner-suggestion-adopt.png";

// ✅ public/assets/brandSolo/*.png
const reportBrandSolo = "/assets/brandSolo/reportBrandSolo.png";
const cdcBrandSolo = "/assets/brandSolo/cdcBrandSolo.png";
const suggestBrandSolo = "/assets/brandSolo/suggestBrandSolo.png";

import { useEffect, useMemo } from "react";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsBigUtils";
import "./FilterIllustration.scss";
import Avatar from "@src/components/shared/Avatar";
import {
  getFilterIllustrationContent,
  normalizeFilterIllustrationKey,
  type FilterIllustrationKey,
  type FilterIllustrationTabKey,
} from "./filterIllustrationContent";

const illustrationMap: Record<FilterIllustrationKey, string> = {
  // === Signalements ===
  default: recentImg,
  hot: hotImg,
  chrono: recentReportImg,
  confirmed: hotImg,
  rage: rageImg,
  popular: popularImg,
  urgent: urgentImg,

  // === Coups de cœur ===
  liked: likedImg,
  popularCdc: likedImg,
  recent: recentCdcImg,
  chronoCdc: recentCdcIcon,
  all: likedImg,
  enflammes: commentedImg,
  recentcdc: commentedImg,

  // === Suggestions ===
  discussed: discussedImg,
  recentSuggestion: recentSuggestionImg,
  allSuggest: discussedImg,
  likedSuggestion: likedSuggestionImg,
};

const illustrationMapWithText: Record<FilterIllustrationKey, string> = {
  // === Signalements ===
  default: reportRecentIcon,
  hot: reportHotIcon,
  chrono: reportRecentIcon,
  confirmed: reportHot2Icon,
  rage: reportHotIcon,
  popular: reportPopularIcon,
  urgent: reportHotIcon,

  // === Coups de cœur ===
  liked: cdcPopularIcon,
  popularCdc: cdcPopularIcon,
  recent: recentCdcImg,
  chronoCdc: recentCdcIcon,
  all: cdcPopularIcon,
  enflammes: cdcEnflamIcon,
  recentcdc: cdcPopularIcon,

  // === Suggestions ===
  discussed: suggestOpenIcon,
  recentSuggestion: suggestOpenIcon,
  allSuggest: suggestPopularIcon,
  likedSuggestion: suggestPopularIcon,
};

export type FilterIllustrationProps = {
  filter: string;
  selectedBrand?: string;
  selectedCategory?: string;
  siteUrl?: string;
  onglet?: FilterIllustrationTabKey;
  withText?: boolean;
};

const FilterIllustration = ({
  filter,
  selectedBrand,
  selectedCategory,
  siteUrl,
  onglet = "report",
  withText = false,
}: FilterIllustrationProps) => {
  const brandEntries = useMemo(() => {
    return selectedBrand ? [{ brand: selectedBrand, siteUrl }] : [];
  }, [selectedBrand, siteUrl]);

  const brandLogos = useBrandLogos(brandEntries);

  const logoUrl = useMemo(() => {
    if (!selectedBrand || !brandLogos) return null;

    const brandKey = selectedBrand.toLowerCase().trim();
    const domain =
      siteUrl
        ?.replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .toLowerCase() || "";

    const possibleKeys = [
      `${brandKey}|${domain}`,
      `${brandKey}|${brandKey}.com`,
      brandKey,
    ];

    for (const k of possibleKeys) {
      if (brandLogos[k]) return brandLogos[k];
    }

    return null;
  }, [selectedBrand, siteUrl, brandLogos]);

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

  const categoryIcon: string | null = useMemo(() => {
    if (!shouldShowCategoryIcon) return null;
    return getCategoryIconPathFromSubcategory(
      selectedCategory,
      selectedBrand,
      onglet,
    );
  }, [selectedCategory, selectedBrand, shouldShowCategoryIcon, onglet]);

  const hasCategorySelection = shouldShowCategoryIcon && !!categoryIcon;

  const brandSoloImg: string | null = useMemo(() => {
    if (!selectedBrand) return null;
    if (onglet === "report") return reportBrandSolo;
    if (onglet === "coupdecoeur") return cdcBrandSolo;
    if (onglet === "suggestion") return suggestBrandSolo;
    return null;
  }, [selectedBrand, onglet]);

  const listKey = useMemo(
    () => normalizeFilterIllustrationKey(filter, onglet),
    [filter, onglet],
  );

  // === Cas 1 : Marque sélectionnée ===
  if (selectedBrand || selectedCategory) {
    const showCategoryOnly = hasCategorySelection && !!categoryIcon;
    const containerClassName = `filter-illustration-sidebar filtered${
      !showCategoryOnly && brandSoloImg ? " brand-solo" : ""
    }`;

    if (showCategoryOnly && categoryIcon) {
      return (
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
    }

    return (
      <div className={containerClassName}>
        <div className="illustration-content">
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
    );
  }

  // === Cas 2 : Aucun filtre ===
  const img = activeIllustrationMap[listKey];
  const { content } = getFilterIllustrationContent(filter, onglet);

  return (
    <div className="filter-illustration-sidebar">
      <div className="illustration-content">
        <img src={img} alt={content.title} />
      </div>
    </div>
  );
};

export default FilterIllustration;
