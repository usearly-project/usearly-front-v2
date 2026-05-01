import React, { useRef, useState } from "react";
import "./ReactionSelector.scss";
import { useReactions } from "@src/hooks/useReactions";

const emojiOptions = ["🔥", "🙌", "💯", "😭", "😡", "💡"];

interface Props {
  userId: string;
  targetId: string; // descriptionId
}

const ReactionSelector: React.FC<Props> = ({ userId, targetId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { getCount, hasReactedWith, handleReact } = useReactions(
    userId,
    targetId,
  );

  const selected = emojiOptions.find(hasReactedWith);

  const handleMouseEnter = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    popupTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="reaction-selector"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="main-reaction" aria-label="Choisir une réaction">
        {selected || "😊"} {selected ? getCount(selected) : ""}
      </button>

      {isOpen && (
        <div className="reaction-popup">
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              className="emoji-button"
              onClick={async () => {
                await handleReact(emoji);
                setIsOpen(false);
              }}
              aria-label={"Réagir avec " + emoji}
            >
              {emoji}
              <span className="count">{getCount(emoji)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionSelector;
