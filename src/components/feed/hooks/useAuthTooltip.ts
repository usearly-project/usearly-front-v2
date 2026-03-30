import { useEffect, useRef, useState } from "react";

export const useAuthTooltip = (durationMs = 2000) => {
  const [tooltipText, setTooltipText] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = (text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTooltipText(text);
    setIsTooltipVisible(true);

    timeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, durationMs);
  };

  return {
    tooltipText,
    isTooltipVisible,
    showTooltip,
  };
};
