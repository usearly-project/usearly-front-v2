export type FilterIllustrationTabKey = "report" | "coupdecoeur" | "suggestion";

export const filterIllustrationContent = {
  default: {
    className: "is-default",
    title: "Filtre les résultats utiles",
  },
  hot: {
    className: "is-hot",
    title: "Ce qui chauffe en ce moment",
  },
  chrono: {
    className: "is-chrono",
    title: "Tout juste signalé !",
  },
  confirmed: {
    className: "is-confirmed",
    title: "Ça chauffe par ici !",
  },
  rage: {
    className: "is-rage",
    title: "Grrr...\nça irrite\nfort !",
  },
  popular: {
    className: "is-popular",
    title: "Ça réagit\npar ici !",
  },
  urgent: {
    className: "is-urgent",
    title: "À traiter en priorité",
  },
  liked: {
    className: "is-liked",
    title: "Les idées les plus aimées",
  },
  popularCdc: {
    className: "is-popular-cdc",
    title: "Bim\nBam\nBoum !",
  },
  recent: {
    className: "is-recent",
    title: "Les derniers coups de coeur",
  },
  chronoCdc: {
    className: "is-chrono-cdc",
    title: "Tout\nfrais,\ntout love",
  },
  all: {
    className: "is-all",
    title: "Tout ce que les utilisateurs adorent",
  },
  enflammes: {
    className: "is-enflammes",
    title: "C’est\nbrûlant\nd’amour",
  },
  recentcdc: {
    className: "is-recentcdc",
    title: "Les plus commentés récemment",
  },
  discussed: {
    className: "is-discussed",
    title: "Les suggestions les plus discutées",
  },
  recentSuggestion: {
    className: "is-recent-suggestion",
    title: "Vous en\nrêvez ?\nVotez",
  },
  allSuggest: {
    className: "is-all-suggest",
    title: "Le top des\nidées !",
  },
  likedSuggestion: {
    className: "is-liked-suggestion",
    title: "Ensemble,\non l’a fait !",
  },
} as const;

export type FilterIllustrationKey = keyof typeof filterIllustrationContent;

const filterKeysByTab: Record<
  FilterIllustrationTabKey,
  FilterIllustrationKey[]
> = {
  report: [
    "default",
    "hot",
    "chrono",
    "confirmed",
    "rage",
    "popular",
    "urgent",
  ],
  coupdecoeur: [
    "liked",
    "popularCdc",
    "recent",
    "chronoCdc",
    "all",
    "enflammes",
    "recentcdc",
  ],
  suggestion: [
    "discussed",
    "recentSuggestion",
    "allSuggest",
    "likedSuggestion",
  ],
};

const fallbackKeyByTab: Record<
  FilterIllustrationTabKey,
  FilterIllustrationKey
> = {
  report: "confirmed",
  coupdecoeur: "all",
  suggestion: "allSuggest",
};

export const normalizeFilterIllustrationKey = (
  filter: string,
  onglet: FilterIllustrationTabKey,
): FilterIllustrationKey => {
  if (onglet === "coupdecoeur") {
    if (filter === "popular") return "popularCdc";
    if (filter === "chrono") return "chronoCdc";
  }

  const typedFilter = filter as FilterIllustrationKey;
  return filterKeysByTab[onglet].includes(typedFilter)
    ? typedFilter
    : fallbackKeyByTab[onglet];
};

export const getFilterIllustrationContent = (
  filter: string,
  onglet: FilterIllustrationTabKey,
) => {
  const key = normalizeFilterIllustrationKey(filter, onglet);

  return {
    key,
    content: filterIllustrationContent[key],
  };
};
