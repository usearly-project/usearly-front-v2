import type { SelectFilterOption } from "@src/components/champs/Champs";
import type {
  CdcFeedFilterValue,
  FeedFilterValue,
  ReportFeedFilterValue,
  SuggestionFeedFilterValue,
} from "./feedFilterTypes";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import usearlyIcon from "/usearly-favicon.png";

export const FILTER_LABELS: Record<FeedFilterValue, string> = {
  all: "L'actu du moment",
  report: "Les signalements",
  coupdecoeur: "Les coups de cœur",
  suggestion: "Les suggestions",
};

export const FILTER_OPTIONS: SelectFilterOption<FeedFilterValue>[] = [
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

export const REPORT_FILTER_LABELS: Record<ReportFeedFilterValue, string> = {
  hot: "Problèmes les plus signalés",
  rage: "Problèmes les plus rageants",
  popular: "Signalements les plus populaires",
  chrono: "Signalements les plus récents",
  urgent: "À shaker vite",
};

export const REPORT_FILTER_OPTIONS: SelectFilterOption<ReportFeedFilterValue>[] =
  [
    {
      value: "hot",
      emoji: "🔥",
      label: REPORT_FILTER_LABELS.hot,
    },
    {
      value: "rage",
      emoji: "😡",
      label: REPORT_FILTER_LABELS.rage,
    },
    {
      value: "popular",
      emoji: "👍",
      label: REPORT_FILTER_LABELS.popular,
    },
    {
      value: "chrono",
      emoji: "📅",
      label: REPORT_FILTER_LABELS.chrono,
    },
  ];

export const CDC_FILTER_LABELS: Record<CdcFeedFilterValue, string> = {
  popular: "Coups de cœur populaires",
  enflammes: "Coups de cœur les plus enflammés",
  chrono: "Coups de cœur les plus récents",
};

export const CDC_FILTER_OPTIONS: SelectFilterOption<CdcFeedFilterValue>[] = [
  {
    value: "popular",
    emoji: "👍",
    label: CDC_FILTER_LABELS.popular,
  },
  {
    value: "enflammes",
    emoji: "❤️‍🔥",
    label: CDC_FILTER_LABELS.enflammes,
  },
  {
    value: "chrono",
    emoji: "💌",
    label: CDC_FILTER_LABELS.chrono,
  },
];

export const SUGGESTION_FILTER_LABELS: Record<
  SuggestionFeedFilterValue,
  string
> = {
  allSuggest: "Suggestions populaires",
  recentSuggestion: "Suggestions ouvertes aux votes",
  likedSuggestion: "Suggestions adoptées",
};

export const SUGGESTION_FILTER_OPTIONS: SelectFilterOption<SuggestionFeedFilterValue>[] =
  [
    {
      value: "allSuggest",
      emoji: "👍️",
      label: SUGGESTION_FILTER_LABELS.allSuggest,
    },
    {
      value: "recentSuggestion",
      emoji: "🪄",
      label: SUGGESTION_FILTER_LABELS.recentSuggestion,
    },
    {
      value: "likedSuggestion",
      emoji: "🙌",
      label: SUGGESTION_FILTER_LABELS.likedSuggestion,
    },
  ];
