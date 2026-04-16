import type { MouseEventHandler, ReactNode } from "react";
import "./Buttons.scss";

type ButtonProps = {
  title: ReactNode;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  addClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function Buttons({
  title,
  onClick,
  type = "button",
  disabled = false,
  addClassName,
  ariaLabel,
}: ButtonProps) {
  const computedAriaLabel =
    ariaLabel ??
    (typeof title === "string" || typeof title === "number"
      ? String(title)
      : undefined);

  return (
    <button
      type={type}
      className={"btn-primary" + (addClassName ? ` ${addClassName}` : "")}
      onClick={onClick}
      disabled={disabled}
      aria-label={computedAriaLabel}
    >
      <span className="btn-primary__label">{title}</span>
    </button>
  );
}

export default Buttons;
