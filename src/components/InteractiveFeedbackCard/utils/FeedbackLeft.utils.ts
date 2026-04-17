import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import { getOfficialPalette } from "@src/utils/brandColorUtils";
import { getBrightness } from "./colorUtils";

export const getFeedbackThemeData = (item: any) => {
  const brandName = item.marque?.trim() ?? "";

  // 🎨 1. Logique de couleurs (On garde tout, c'est parfait)
  const { base, light, isDark } = getBrandThemeColor(brandName);
  const palette = getOfficialPalette(brandName) as any;
  const brightness = getBrightness(base);

  let adjustedBase = base;
  if (brightness < 25) adjustedBase = "color-mix(in srgb, black 85%, white)";
  else if (brightness > 240) adjustedBase = "#E5E5E5";

  let svgColor: string;

  if (palette && palette.accent) {
    svgColor = palette.accent;
  } else if (
    item.meta?.axe === "illustration" &&
    (brightness < 25 || brightness > 240)
  ) {
    const accents = ["#E53935", "#1E88E5", "#8E24AA", "#FB8C00"];
    svgColor = accents[brandName.length % accents.length];
  } else {
    svgColor =
      brightness < 140
        ? `color-mix(in srgb, ${adjustedBase} 30%, white)` // Sur fond sombre : Icône claire
        : `color-mix(in srgb, ${adjustedBase} 70%, black)`; // <-- ICI : 70% de couleur au lieu de 25%
  }

  // 🧱 2. Logique de Background (On garde aussi)
  const backgroundVariant =
    item.meta?.axe === "illustration"
      ? adjustedBase
      : item.meta?.axe === "typography"
        ? `color-mix(in srgb, ${adjustedBase} 20%, white)`
        : item.meta?.axe === "emoji"
          ? `color-mix(in srgb, ${adjustedBase} 10%, white)`
          : adjustedBase;

  // 🚀 3. Retour des datas
  // On supprime les appels à decideIllustration et getIllustrationFromText !
  return {
    base: adjustedBase,
    light,
    isDark,
    brightness,
    backgroundVariant,
    svgColor,
    palette,
    // On peut laisser la propriété "illustration" à null ou la supprimer,
    // car on va utiliser item.illustration directement dans le composant.
    illustration: null,
  };
};
