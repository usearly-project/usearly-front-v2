import { getIllustrationFromText } from "./getIllustrationFromText";
import { SUGGEST_CATEGORY_MAPPING } from "./illustrationSuggestKeywords";

export function decideIllustration(
  title: string | null | undefined,
  description: string | null | undefined,
  type: "coupdecoeur" | "suggestion",
): string | null {
  const safeDescription = description?.trim() || "";
  if (!safeDescription) return null;

  const isSuggestion = type === "suggestion";
  const basePath = isSuggestion ? "bobAssetsSuggest" : "bobAssets";
  const keywordsMap = isSuggestion ? SUGGEST_CATEGORY_MAPPING : undefined;

  // 1. On calcule l'illustration
  const illustration = getIllustrationFromText(
    "",
    safeDescription,
    keywordsMap,
    basePath,
  );

  // 2. Détection du type d'image retournée
  // Si le chemin contient "/general/", c'est que le score était trop bas (FallBack)
  const isGeneric = illustration.includes("/general/");

  // Nombre de lignes pour l'impact visuel
  const lineCount = safeDescription.split("\n").length;

  // 🔸 RÈGLE 1 : Si c'est une Suggestion
  if (isSuggestion) {
    // Si c'est long (2 lignes+), on décore TOUJOURS
    if (lineCount > 1) return illustration;

    // Si c'est court, on ne l'affiche QUE si on a trouvé un vrai métier (pas de /general/)
    // OU si on a un mot-clé d'intention très clair
    const suggestionTriggers = [
      "idée",
      "proposer",
      "nouveau",
      "changer",
      "améliorer",
      "ajouter",
      "pourquoi pas",
      "serait bien",
      "visualiser",
    ];
    const hasTrigger = suggestionTriggers.some((word) =>
      safeDescription.toLowerCase().includes(word),
    );

    if (!isGeneric || hasTrigger) return illustration;

    return null;
  }

  // 🔸 RÈGLE 2 : Si c'est un Coup de Cœur (CDC)
  // On ne l'affiche que si c'est parlant :
  // - Soit c'est un texte long (on veut remplir l'espace)
  // - Soit on a trouvé une thématique métier (banque, sport, etc.) -> donc pas de /general/
  if (lineCount > 1 || !isGeneric) {
    return illustration;
  }

  return null;
}
