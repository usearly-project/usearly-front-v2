import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { AuthTooltipPosition } from "@src/components/shared/AuthTooltip";
import { useLoginModal } from "@src/components/context/LoginModalContext";

// On importe ton nouveau contexte ici

type AuthTooltipTriggerEvent =
  | ReactMouseEvent<HTMLElement>
  | ReactPointerEvent<HTMLElement>
  | MouseEvent
  | PointerEvent;

const getPositionFromEvent = (
  event?: AuthTooltipTriggerEvent,
): AuthTooltipPosition => {
  if (!event) return null;

  if (typeof event.clientX === "number" && typeof event.clientY === "number") {
    return { x: event.clientX, y: event.clientY };
  }

  const currentTarget =
    "currentTarget" in event && event.currentTarget instanceof HTMLElement
      ? event.currentTarget
      : null;

  if (!currentTarget) return null;

  const rect = currentTarget.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

export const useAuthTooltip = () => {
  // On récupère la fonction pour ouvrir la modale
  const { openLoginModal } = useLoginModal();

  const authTooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointerPosition = useRef<{
    position: AuthTooltipPosition;
    timestamp: number;
  } | null>(null);

  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] =
    useState<AuthTooltipPosition>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handlePointerDown = (event: PointerEvent) => {
      lastPointerPosition.current = {
        position: { x: event.clientX, y: event.clientY },
        timestamp: Date.now(),
      };
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      if (authTooltipTimeout.current) {
        clearTimeout(authTooltipTimeout.current);
      }
    };
  }, []);

  const triggerTooltip = useCallback(
    (text: string, event?: AuthTooltipTriggerEvent) => {
      // --- LA LOGIQUE D'INTERCEPTION ---
      // Si le texte contient "connecte-toi" (on force en minuscule pour être sûr)
      if (text.toLowerCase().includes("connecte-toi")) {
        openLoginModal(); // On ouvre la modale
        return; // On arrête TOUT ici (le tooltip ne s'affichera pas)
      }
      // ---------------------------------

      if (authTooltipTimeout.current) {
        clearTimeout(authTooltipTimeout.current);
      }

      const fallbackPosition =
        lastPointerPosition.current &&
        Date.now() - lastPointerPosition.current.timestamp < 1000
          ? lastPointerPosition.current.position
          : null;

      setTooltipPosition(getPositionFromEvent(event) ?? fallbackPosition);
      setTooltipText(text);
      setShowAuthTooltip(true);

      authTooltipTimeout.current = setTimeout(() => {
        setShowAuthTooltip(false);
        authTooltipTimeout.current = null;
      }, 2000);
    },
    [openLoginModal], // On ajoute la dépendance pour useCallback
  );

  return {
    showAuthTooltip,
    tooltipText,
    tooltipPosition,
    triggerTooltip,
  };
};
