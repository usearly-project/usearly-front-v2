import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import { getOfficialPalette } from "@src/utils/brandColorUtils";
import { decideIllustration } from "@src/utils/getIllustrationDecision";
import { getBrightness } from "./colorUtils";
import { getIllustrationFromText } from "@src/utils/getIllustrationFromText";

export const getFeedbackThemeData = (item: any) => {
  const brandName = item.marque?.trim() ?? "";
  const userVerbatim = item.description || "";
  const isSuggestion = item.type === "suggestion";

  const { base, light, isDark } = getBrandThemeColor(brandName);

  // ✅ On cast en "any" pour éviter l'erreur sur .accent
  const palette = getOfficialPalette(brandName) as any;
  const brightness = getBrightness(base);

  let adjustedBase = base;
  if (brightness < 25) adjustedBase = "color-mix(in srgb, black 85%, white)";
  else if (brightness > 240) adjustedBase = "#E5E5E5";

  let svgColor: string;

  // ✅ Utilisation de la palette avec sécurité
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
        ? `color-mix(in srgb, ${adjustedBase} 30%, white)`
        : `color-mix(in srgb, ${adjustedBase} 25%, black)`;
  }

  const illustrationResult = decideIllustration("", userVerbatim, item.type);

  const backgroundVariant =
    item.meta?.axe === "illustration"
      ? adjustedBase
      : item.meta?.axe === "typography"
        ? `color-mix(in srgb, ${adjustedBase} 20%, white)`
        : item.meta?.axe === "emoji"
          ? `color-mix(in srgb, ${adjustedBase} 10%, white)`
          : adjustedBase;

  return {
    base: adjustedBase,
    light,
    isDark,
    brightness,
    backgroundVariant,
    svgColor,
    palette,
    illustration:
      illustrationResult ??
      getIllustrationFromText(
        "",
        userVerbatim,
        undefined,
        isSuggestion ? "bobAssetsSuggest" : "bobAssets",
      ),
  };
};
