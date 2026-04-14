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

const AuthTooltip = ({ show, text, position }: Props) => {
  if (!show) return null;

  const tooltip = (
    <div
      className={`auth-tooltip auth-tooltip-portal${position ? " auth-tooltip-portal--at-pointer" : ""}`}
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
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
