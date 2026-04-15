import React, { forwardRef } from "react";
import {
  breakAtBestVisualWidth,
  reflowPreferTwoLines,
} from "../utils/layoutUtils";
import { htmlToWords } from "../utils/textFormatUtils";

interface BubbleProps {
  line: string;
  index: number;
  themeBase: string;
  isIllustration: boolean;
  brandBrightness: number;
  wrapWordCount: number | null;
  bubbleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  layoutType?: string;
  textColor: string;
}

const FeedbackBubble = forwardRef<HTMLDivElement, BubbleProps>((props, ref) => {
  const {
    line,
    index,
    themeBase,
    isIllustration,
    brandBrightness,
    wrapWordCount,
    bubbleRefs,
    layoutType,
    textColor,
  } = props;

  const isPrimary = index === 0;
  const isWrapped = wrapWordCount != null;
  const brandIsLight = brandBrightness > 235;

  // --- 🎨 LOGIQUE DE COULEUR (Extraite du composant original) ---
  let bubbleBg: string;
  let bubbleTextColor: string;

  if (isIllustration) {
    if (isPrimary) {
      bubbleBg = brandIsLight ? "#000000" : "#ffffff";
      bubbleTextColor = brandIsLight ? "#ffffff" : "#000000";
    } else {
      bubbleBg = brandIsLight ? "#ffffff" : "#000000";
      bubbleTextColor = brandIsLight ? "#000000" : "#ffffff";
    }
  } else {
    bubbleBg = isPrimary ? "#ffffff" : themeBase;
    bubbleTextColor = isPrimary ? "#000000" : textColor;
  }

  // --- ✍️ LOGIQUE DE WRAP (Optimisation visuelle) ---
  let formattedHtml = line;
  if (isWrapped) {
    const words = htmlToWords(line);
    const el = bubbleRefs.current[index];

    if (el && words.length > 2) {
      const k = Math.min(
        Math.max(2, breakAtBestVisualWidth(el, words)),
        words.length - 1,
      );
      const first = words.slice(0, k).join(" ");
      const second = words.slice(k).join(" ");
      formattedHtml = second ? `${first} <br/>${second}` : first;
    } else {
      formattedHtml = reflowPreferTwoLines(line, wrapWordCount as number);
    }
  }

  return (
    <div
      ref={ref}
      className={`bubble ${isPrimary ? "primary" : "secondary"} ${
        isWrapped ? "wrap" : "nowrap"
      } ${layoutType === "two-bubble" ? "two-bubble" : ""}`}
      data-wrapped={isWrapped ? "true" : "false"}
      data-wrap-word-count={wrapWordCount ?? undefined}
      style={{
        ["--bubble-bg" as any]: bubbleBg,
        ["--bubble-text" as any]: bubbleTextColor,
        ["--bubble-border-width" as any]: isPrimary ? "2px" : "0px",
        ["--bubble-border-color" as any]: isPrimary ? "#000000" : "transparent",
        ["--bubble-tail-offset" as any]: "32px",
        ["--bubble-tail-size" as any]: "14px",
        backgroundColor: bubbleBg,
        color: bubbleTextColor,
      }}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
});

FeedbackBubble.displayName = "FeedbackBubble";

export default FeedbackBubble;
