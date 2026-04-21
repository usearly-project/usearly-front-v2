import React, { useMemo } from "react";
import { BrandSvg } from "../../shared/BrandSvg";
import TypographyBlock from "./blocks/TypographyBlock";
import EmojiBlock from "./blocks/EmojiBlock";
import FeedbackBubble from "../components/FeedbackBubble";
import { getTextColorForBackground } from "../utils/feedbackColors";
import { getFeedbackThemeData } from "../utils/FeedbackLeft.utils";
import { useFeedbackLayout } from "../hooks/useFeedbackLayout";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  isExpanded?: boolean;
}

const FeedbackLeft: React.FC<Props> = ({ item, isExpanded = false }) => {
  const theme = useMemo(() => getFeedbackThemeData(item), [item]);
  const textColor = getTextColorForBackground(theme.base);

  // ✅ NOUVEAU : Construction du chemin dynamique vers l'icône du Back-end
  const illustrationPath = useMemo(() => {
    const category = item.category || item.meta?.aiCategory;

    if (!category || !item.illustration) return null;

    const root = item.type === "coupdecoeur" ? "bobAssets" : "bobAssetsSuggest";

    return `/assets/${root}/${category}/${item.illustration}`;
  }, [item]);

  // 🔥 fallback vers ancien système
  const finalIllustration = illustrationPath || theme.illustration;

  const lines = useMemo(() => {
    if (!item.punchline) return [];
    return item.punchline
      .replace(/\\\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .split("\n");
  }, [item.punchline]);

  const { punchlinesRef, bubbleRefs, wrappedWordsByIndex } =
    useFeedbackLayout(lines);

  if (!item.punchline) return null;

  return (
    <div className={`feedback-type${isExpanded ? " is-expanded" : ""}`}>
      <div
        className="feedback-left"
        style={{
          backgroundColor: theme.backgroundVariant,
          ["--feedback-text-color" as any]:
            item.meta?.axe === "typography" ? "#000000" : textColor,
          ["--brand-color" as any]: theme.base,
        }}
        data-axe={item.meta?.axe || "typography"}
        data-theme={theme.isDark ? "dark" : "light"}
        data-light-brand={theme.brightness > 235 ? "true" : "false"}
      >
        {/* === AXE TYPO === */}
        {item.meta?.axe === "typography" && (
          <>
            <TypographyBlock
              punchline={item.punchline}
              highlightedWords={item.meta?.highlightedWords}
              baseColor={theme.base}
              getTextColorForBackground={getTextColorForBackground}
            />

            {/* ✅ MODIFIÉ : Utilise illustrationPath au lieu de theme.illustration */}
            {illustrationPath && (
              <div className="typography-icon-wrapper">
                <BrandSvg
                  src={illustrationPath}
                  brandColor={`color-mix(in srgb, ${theme.base} 100%, white)`}
                  className="typography-icon"
                  alt="Decorative icon"
                />
              </div>
            )}
          </>
        )}

        {/* AXE EMOJI */}
        {item.meta?.axe === "emoji" && (
          <EmojiBlock
            punchline={item.punchline}
            emoji={item.emoji}
            highlightedWords={item.meta?.highlightedWords}
            highlightEmojiClass={
              theme.brightness > 150
                ? "highlight-emoji highlight-emoji--dark"
                : "highlight-emoji"
            }
            highlightEmojiColor={
              theme.brightness > 150 ? "#000000" : theme.base
            }
            backgroundVariant={theme.backgroundVariant}
            baseColor={theme.base}
            lightColor={theme.light}
            themeMode={theme.isDark ? "dark" : "light"}
            highlightEmojiNeedsContrast={theme.brightness > 150}
          />
        )}

        {/* AXE ILLUSTRATION / DEFAULT */}
        {item.meta?.axe !== "typography" && item.meta?.axe !== "emoji" && (
          <>
            <div className="punchlines" ref={punchlinesRef}>
              {lines.map((line, index) => (
                <FeedbackBubble
                  key={index}
                  ref={(el) => {
                    bubbleRefs.current[index] = el;
                  }}
                  line={line}
                  index={index}
                  themeBase={theme.base}
                  isIllustration={item.meta?.axe === "illustration"}
                  brandBrightness={theme.brightness}
                  wrapWordCount={wrappedWordsByIndex[index]}
                  bubbleRefs={bubbleRefs}
                  layoutType={item.meta?.layoutType}
                  textColor={textColor}
                />
              ))}
            </div>

            {item.meta?.axe === "illustration" && (
              <div
                className="illu-wrapper"
                style={{ backgroundColor: "transparent", color: "#000" }}
              >
                {/* ✅ MODIFIÉ : Utilise illustrationPath au lieu de theme.illustration */}
                {finalIllustration && (
                  <BrandSvg
                    src={finalIllustration}
                    brandColor={theme.svgColor ?? theme.base}
                    className="illu-image"
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackLeft;
