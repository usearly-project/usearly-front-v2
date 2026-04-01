import { useState, useLayoutEffect, useRef } from "react";
import { countWordsFromHTML } from "../utils/textFormatUtils";

export const useFeedbackLayout = (lines: string[]) => {
  const punchlinesRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wrappedWordsByIndex, setWrappedWordsByIndex] = useState<
    (number | null)[]
  >([]);

  useLayoutEffect(() => {
    const compute = () => {
      const next = bubbleRefs.current.map((el, i) => {
        if (!el) return null;
        const h = el.getBoundingClientRect().height;
        return h > 50 ? countWordsFromHTML(lines[i] || "") : null;
      });
      setWrappedWordsByIndex(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (punchlinesRef.current) ro.observe(punchlinesRef.current);
    bubbleRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [lines]);

  return { punchlinesRef, bubbleRefs, wrappedWordsByIndex };
};
