import {
  CATEGORY_MAPPING,
  CATEGORY_IMAGES,
  GENERAL_POOL,
} from "./illustrationKeywords";
import {
  SUGGEST_CATEGORY_MAPPING,
  SUGGEST_CATEGORY_IMAGES,
  SUGGEST_GENERAL_POOL,
} from "./illustrationSuggestKeywords";

export function getIllustrationFromText(
  _unusedTitle: string,
  userDescription: string = "",
  keywordsMap?: any,
  basePath: string = "bobAssets",
): string {
  const content = userDescription.toLowerCase();
  const isSuggestion = basePath === "bobAssetsSuggest";

  // 🚨 1. VERROUILLAGE DES SOURCES
  // On utilise keywordsMap si passé, sinon on switch selon le type.
  const currentMapping =
    keywordsMap || (isSuggestion ? SUGGEST_CATEGORY_MAPPING : CATEGORY_MAPPING);
  const currentImagesRef = isSuggestion
    ? SUGGEST_CATEGORY_IMAGES
    : CATEGORY_IMAGES;
  const currentPool = isSuggestion ? SUGGEST_GENERAL_POOL : GENERAL_POOL;

  let bestCategory = "general";
  let maxScore = 0;

  // 2. SCORING PONDÉRÉ
  // 2. SCORING PONDÉRÉ (Version anti "cont-rib-uez")
  Object.entries(currentMapping).forEach(([category, data]) => {
    let currentScore = 0;

    const calculateScore = (word: string, points: number) => {
      // 🚨 \b permet de s'assurer que le mot est "entier" (ex: "rib" ne matchera pas "contribuez")
      // On utilise 'gi' pour être insensible à la casse (Global + IgnoreCase)
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, "gi");
      if (regex.test(content)) {
        currentScore += points;
      }
    };

    // Format Objet (High/Low)
    if (typeof data === "object" && !Array.isArray(data)) {
      const { high = [], low = [] } = data as { high: string[]; low: string[] };
      high.forEach((word) => calculateScore(word, 3));
      low.forEach((word) => calculateScore(word, 1));
    }
    // Format Tableau (Ancien)
    else {
      const keywordsArray = Array.isArray(data) ? data : [];
      keywordsArray.forEach((word) => calculateScore(word, 1));
    }

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestCategory = category;
    }
  });

  // 3. SÉLECTION FINALE
  let subFolder: string;
  let fileName: string;
  const CONFIDENCE_THRESHOLD = 3;

  if (maxScore >= CONFIDENCE_THRESHOLD && bestCategory !== "general") {
    subFolder = bestCategory;
    fileName = currentImagesRef[bestCategory];
  } else {
    // 🎲 ALÉATOIRE STABLE (Uniquement dans le pool autorisé)
    subFolder = "general";
    let hash = 0;
    for (let i = 0; i < userDescription.length; i++) {
      hash = (hash << 5) - hash + userDescription.charCodeAt(i);
      hash |= 0;
    }
    // Ici, currentPool est FORCÉMENT SUGGEST_GENERAL_POOL si c'est une suggestion
    const index = Math.abs(hash) % currentPool.length;
    fileName = currentPool[index];
  }

  // 4. SÉCURITÉ NOM DE FICHIER
  if (!fileName) {
    fileName = isSuggestion ? "emojiteteetoile.svg" : "coeurdoigt.svg";
  }

  return `/assets/${basePath}/${subFolder}/${fileName}`;
}
