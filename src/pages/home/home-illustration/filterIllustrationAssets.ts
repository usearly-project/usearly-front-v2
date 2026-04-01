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
import likedImg from "/assets/img-banner/banner-cdc-pop.png";
import recentCdcImg from "/assets/img-banner/banner-cdc-recent.png";
import recentCdcIcon from "/assets/img-banner/withoutText/cdc-recent.svg";
import commentedImg from "/assets/img-banner/banner-cdc-liked.png";
import discussedImg from "/assets/img-banner/banner-suggestion-top-idea.png";
import recentSuggestionImg from "/assets/img-banner/banner-suggestion-reves.png";
import likedSuggestionImg from "/assets/img-banner/banner-suggestion-adopt.png";
import type {
  FilterIllustrationKey,
  FilterIllustrationTabKey,
} from "./filterIllustrationContent";

const reportBrandSolo = "/assets/brandSolo/reportBrandSolo.png";
const cdcBrandSolo = "/assets/brandSolo/cdcBrandSolo.png";
const suggestBrandSolo = "/assets/brandSolo/suggestBrandSolo.png";

export const illustrationMap: Record<FilterIllustrationKey, string> = {
  default: recentImg,
  hot: hotImg,
  chrono: recentReportImg,
  confirmed: hotImg,
  rage: rageImg,
  popular: popularImg,
  urgent: urgentImg,
  liked: likedImg,
  popularCdc: likedImg,
  recent: recentCdcImg,
  chronoCdc: recentCdcIcon,
  all: likedImg,
  enflammes: commentedImg,
  recentcdc: commentedImg,
  discussed: discussedImg,
  recentSuggestion: recentSuggestionImg,
  allSuggest: discussedImg,
  likedSuggestion: likedSuggestionImg,
};

export const illustrationMapWithText: Record<FilterIllustrationKey, string> = {
  default: reportRecentIcon,
  hot: reportHotIcon,
  chrono: reportRecentIcon,
  confirmed: reportHot2Icon,
  rage: reportHotIcon,
  popular: reportPopularIcon,
  urgent: reportHotIcon,
  liked: cdcPopularIcon,
  popularCdc: cdcPopularIcon,
  recent: recentCdcImg,
  chronoCdc: recentCdcIcon,
  all: cdcPopularIcon,
  enflammes: cdcEnflamIcon,
  recentcdc: cdcPopularIcon,
  discussed: suggestOpenIcon,
  recentSuggestion: suggestOpenIcon,
  allSuggest: suggestPopularIcon,
  likedSuggestion: suggestPopularIcon,
};

export const getBrandSoloIllustration = (
  selectedBrand: string | undefined,
  onglet: FilterIllustrationTabKey,
) => {
  if (!selectedBrand) return null;
  if (onglet === "report") return reportBrandSolo;
  if (onglet === "coupdecoeur") return cdcBrandSolo;
  if (onglet === "suggestion") return suggestBrandSolo;
  return null;
};
