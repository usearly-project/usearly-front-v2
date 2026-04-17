import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./AuthTooltip.scss";

export type AuthTooltipPosition = {
  x: number;
  y: number;
} | null;

type Props = {
  show: boolean;
  text: string;
  position: AuthTooltipPosition;
};

const VIEWPORT_PADDING = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const AuthTooltip = ({ show, text, position }: Props) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [clampedPosition, setClampedPosition] =
    useState<AuthTooltipPosition>(null);
  const positionX = position?.x;
  const positionY = position?.y;

  useLayoutEffect(() => {
    if (
      !show ||
      typeof positionX !== "number" ||
      typeof positionY !== "number" ||
      typeof window === "undefined"
    ) {
      setClampedPosition(null);
      return;
    }

    const updateClampedPosition = () => {
      const tooltipElement = tooltipRef.current;
      if (!tooltipElement) return;

      const rect = tooltipElement.getBoundingClientRect();
      const maxX = Math.max(
        VIEWPORT_PADDING,
        window.innerWidth - rect.width - VIEWPORT_PADDING,
      );
      const maxY = Math.max(
        VIEWPORT_PADDING,
        window.innerHeight - rect.height - VIEWPORT_PADDING,
      );
      const nextPosition = {
        x: clamp(positionX, VIEWPORT_PADDING, maxX),
        y: clamp(positionY, VIEWPORT_PADDING, maxY),
      };

      setClampedPosition((previousPosition) =>
        previousPosition?.x === nextPosition.x &&
        previousPosition?.y === nextPosition.y
          ? previousPosition
          : nextPosition,
      );
    };

    updateClampedPosition();
    window.addEventListener("resize", updateClampedPosition);

    return () => {
      window.removeEventListener("resize", updateClampedPosition);
    };
  }, [show, positionX, positionY, text]);

  if (!show) return null;

  const displayPosition = position ? (clampedPosition ?? position) : null;

  const tooltip = (
    <div
      ref={tooltipRef}
      className={`auth-tooltip auth-tooltip-portal${position ? " auth-tooltip-portal--at-pointer" : ""}`}
      style={
        displayPosition
          ? {
              left: `${displayPosition.x}px`,
              top: `${displayPosition.y}px`,
            }
          : undefined
      }
    >
      {text}
    </div>
  );

  if (typeof document === "undefined") {
    return tooltip;
  }

  return createPortal(tooltip, document.body);
};

export default AuthTooltip;
