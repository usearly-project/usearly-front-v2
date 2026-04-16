import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import usearlyIcon from "/usearly-favicon.png";
import type { FeedFilterValue } from "../types/feedFilterTypes";

export const FILTER_LABELS: Record<FeedFilterValue, string> = {
  all: "L'actu du moment",
  report: "Les signalements",
  coupdecoeur: "Les coups de cœur",
  suggestion: "Les suggestions",
};

export const FILTER_OPTIONS: any[] = [
  { value: "all", iconUrl: usearlyIcon, label: FILTER_LABELS.all },
  { value: "report", iconUrl: reportYellowIcon, label: FILTER_LABELS.report },
  {
    value: "coupdecoeur",
    iconUrl: likeRedIcon,
    label: FILTER_LABELS.coupdecoeur,
  },
  {
    value: "suggestion",
    iconUrl: suggestGreenIcon,
    label: FILTER_LABELS.suggestion,
  },
];

export const REPORT_FILTER_OPTIONS: any[] = [
  { value: "hot", emoji: "🔥", label: "Les plus signalés" },
  { value: "rage", emoji: "😡", label: "Les plus rageants" },
  { value: "popular", emoji: "👍", label: "Les plus populaires" },
  { value: "chrono", emoji: "📅", label: "Les plus récents" },
];

export const CDC_FILTER_OPTIONS: any[] = [
  { value: "popular", emoji: "👍", label: "Populaires" },
  {
    value: "enflammes",
    emoji: "❤️‍🔥",
    label: "Les plus enflammés",
  },
  { value: "chrono", emoji: "💌", label: "Les plus récents" },
];

export const SUGGESTION_FILTER_OPTIONS: any[] = [
  { value: "allSuggest", emoji: "👍️", label: "Populaires" },
  {
    value: "recentSuggestion",
    emoji: "🪄",
    label: "Ouvertes aux votes",
  },
  { value: "likedSuggestion", emoji: "🙌", label: "Adoptées" },
];
