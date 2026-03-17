import { type CSSProperties } from "react";
import { POP_FEED_THEME_CONFIG } from "./planetCanvasConfig";
import type { PlanetPopFeedBubble, PlanetPopFeedItemData } from "./types";

type PlanetCanvasBubbleProps = {
  bubble: PlanetPopFeedBubble;
  icon: string;
};

const PlanetCanvasBubble = ({ bubble, icon }: PlanetCanvasBubbleProps) => (
  <div
    className="planet-pop-feed__bubble"
    style={
      {
        "--planet-pop-feed-delay": `${bubble.delayMs}ms`,
      } as CSSProperties
    }
  >
    <span className="planet-pop-feed__bubble-icon">
      <img src={icon} alt="" aria-hidden="true" />
    </span>
    <span className="planet-pop-feed__bubble-text">{bubble.message}</span>
    <span className="planet-pop-feed__bubble-brand">
      <img src={bubble.brandImage} alt="" aria-hidden="true" />
    </span>
  </div>
);

type PlanetCanvasFeedItemProps = {
  item: PlanetPopFeedItemData;
};

const PlanetCanvasFeedItem = ({ item }: PlanetCanvasFeedItemProps) => {
  const themeConfig = POP_FEED_THEME_CONFIG[item.theme];
  const bubbleAlignmentClass =
    item.position.x <= 28
      ? "planet-pop-feed__item--align-start"
      : item.position.x >= 72
        ? "planet-pop-feed__item--align-end"
        : "planet-pop-feed__item--align-center";
  const itemStyle = {
    left: `${item.position.x}%`,
    top: `${item.position.y}%`,
    "--planet-pop-feed-item-delay": `${item.appearanceDelayMs}ms`,
    "--planet-pop-feed-surface": themeConfig.surface,
    "--planet-pop-feed-border": themeConfig.border,
    "--planet-pop-feed-shadow": themeConfig.shadow,
    "--planet-pop-feed-rotation": `${item.rotation}deg`,
  } as CSSProperties;

  return (
    <div
      className={`planet-pop-feed__item planet-pop-feed__item--${item.theme} ${bubbleAlignmentClass}`}
      style={itemStyle}
    >
      <div className="planet-pop-feed__bubbles">
        {item.bubbles.map((bubble) => (
          <PlanetCanvasBubble
            key={bubble.id}
            bubble={bubble}
            icon={themeConfig.icon}
          />
        ))}
      </div>
      <div className="planet-pop-feed__photo-shell">
        <img
          className="planet-pop-feed__photo"
          src={item.image}
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default PlanetCanvasFeedItem;
