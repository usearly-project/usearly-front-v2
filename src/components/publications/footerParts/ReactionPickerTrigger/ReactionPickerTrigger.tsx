import React from "react";
import { ThumbsUp } from "lucide-react";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { useIsMobile } from "@src/hooks/use-mobile";

type TypeKind = "coupdecoeur" | "suggestion";

interface Props {
  userId?: string;
  descriptionId: string;
  type: TypeKind;
  disabled?: boolean;
  addClassName?: string;
  onSelect: (emoji: string) => Promise<void> | void;
}

export default function ReactionPickerTrigger({
  userId = "",
  descriptionId,
  type,
  addClassName = "",
  disabled = false,
  onSelect,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const hoverTimeoutRef = React.useRef<number | null>(null);
  const isMobile = useIsMobile();

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const onEnter = () => {
    clearHoverTimeout();
    setOpen(true);
  };

  const onLeave = () => {
    clearHoverTimeout();
    hoverTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 250);
  };

  React.useEffect(() => clearHoverTimeout, []);

  return (
    <div
      className={"react-hover-area " + addClassName}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={type === "coupdecoeur" ? "Réagir" : "Choisir une réaction"}
      >
        <ThumbsUp size={16} />
        {!isMobile && <>{type === "coupdecoeur" && <span>Réagir</span>}</>}
      </button>

      {open && !disabled && (
        <div
          className="emoji-picker-container"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <EmojiUrlyReactionPicker
            onSelect={onSelect}
            type={type}
            userId={userId}
            descriptionId={descriptionId}
          />
        </div>
      )}
    </div>
  );
}
