import { getRandomBetween, getDistance, clamp } from "./planetCanvasUtils";
import { POP_FEED_MAX_ATTEMPTS } from "./planetCanvasConfig";

const MIN_X_DISTANCE = 18;
const MIN_Y_DISTANCE = 16;
const MIN_REPORT_Y_DISTANCE = 24;

const hasNoOverlap = (
  candidate: PlanetCanvasPosition,
  occupied: PlanetCanvasPosition[],
  minDist: number,
) =>
  occupied.every(
    (p) =>
      getDistance(p, candidate) >= minDist &&
      (Math.abs(p.x - candidate.x) >= MIN_X_DISTANCE ||
        Math.abs(p.y - candidate.y) >= MIN_Y_DISTANCE),
  );
import type {
  PlanetCanvasPosition,
  PopFeedTheme,
  PlanetPopFeedItemData,
} from "./types";

export const createFeedItemId = () =>
  `planet-feed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const buildFeedItem = (args: any): PlanetPopFeedItemData => ({
  id: args.itemId,
  brandId: args.brand.id,
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
    if (hasNoOverlap(candidate, occupiedPositions, minDistance))
      return candidate;
  }
  return { x: getRandomBetween(18, 78), y: getRandomBetween(minY, 78) };
};

export const pickRelatedReportPosition = (
  anchor: PlanetCanvasPosition,
  minDistance: number,
  offset: number,
  vRange: number,
  occupiedPositions: PlanetCanvasPosition[] = [],
) => {
  const primaryDirection = anchor.x > 50 ? -1 : 1;
  const directions = [primaryDirection, -primaryDirection];
  const requiredAnchorDistance = Math.max(minDistance, offset * 0.9);

  for (let attempt = 0; attempt < POP_FEED_MAX_ATTEMPTS; attempt++) {
    const direction = directions[attempt % directions.length];
    const candidate = {
      x: clamp(
        anchor.x + direction * getRandomBetween(offset, offset + 14),
        12,
        88,
      ),
      y: clamp(anchor.y + getRandomBetween(-vRange, vRange), 30, 82),
    };

    if (
      getDistance(anchor, candidate) >= requiredAnchorDistance &&
      Math.abs(anchor.y - candidate.y) >= MIN_REPORT_Y_DISTANCE &&
      hasNoOverlap(candidate, occupiedPositions, minDistance)
    ) {
      return candidate;
    }
  }

  const fallbackYOffset = Math.max(vRange, MIN_REPORT_Y_DISTANCE);
  return {
    x: clamp(anchor.x + primaryDirection * offset, 12, 88),
    y: clamp(
      anchor.y + (anchor.y > 56 ? -fallbackYOffset : fallbackYOffset),
      30,
      82,
    ),
  };
};
