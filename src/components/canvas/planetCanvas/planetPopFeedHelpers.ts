import { getRandomBetween, getDistance, clamp } from "./planetCanvasUtils";
import { POP_FEED_MAX_ATTEMPTS } from "./planetCanvasConfig";
import type {
  PlanetCanvasPosition,
  PopFeedTheme,
  PlanetPopFeedItemData,
} from "./types";

export const createFeedItemId = () =>
  `planet-feed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const buildFeedItem = (args: any): PlanetPopFeedItemData => ({
  id: args.itemId,
  theme: args.theme,
  image: args.image,
  appearanceDelayMs: args.appearanceDelayMs,
  position: args.position,
  rotation: getRandomBetween(-7, 7),
  bubbles: [
    {
      id: args.bubbleId,
      message: args.message,
      delayMs: 0,
      brandImage: args.brand.image,
    },
  ],
});

export const pickPosition = (
  theme: PopFeedTheme,
  minDistance: number,
  occupiedPositions: PlanetCanvasPosition[] = [],
) => {
  const minY = theme === "report" ? 35 : 30;
  for (let attempt = 0; attempt < POP_FEED_MAX_ATTEMPTS; attempt++) {
    const candidate = {
      x: getRandomBetween(15, 82),
      y: getRandomBetween(minY, 79),
    };
    if (
      occupiedPositions.every((p) => getDistance(p, candidate) >= minDistance)
    )
      return candidate;
  }
  return { x: getRandomBetween(18, 78), y: getRandomBetween(minY, 78) };
};

export const pickRelatedReportPosition = (
  anchor: PlanetCanvasPosition,
  minDistance: number,
  offset: number,
  vRange: number,
) => {
  const direction = anchor.x > 56 ? -1 : 1;
  const candidate = {
    x: clamp(
      anchor.x + direction * getRandomBetween(offset, offset + 8),
      16,
      84,
    ),
    y: clamp(anchor.y + getRandomBetween(-vRange, vRange), 34, 78),
  };
  return candidate;
};
