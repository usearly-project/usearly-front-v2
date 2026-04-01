import { useEffect, useRef, useState } from "react";
import * as Config from "./planetCanvasConfig";
import * as Utils from "./planetCanvasUtils";
import * as Helpers from "./planetPopFeedHelpers";
import type { PlanetPopFeedItemData } from "./types";

const usePlanetPopFeed = (enabled: boolean) => {
  const [feedItems, setFeedItems] = useState<PlanetPopFeedItemData[]>([]);
  const activeItemsRef = useRef<PlanetPopFeedItemData[]>([]);
  const imagePoolRef = useRef<number[]>([]);
  const lastImageIndexRef = useRef(-1);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) {
      setFeedItems([]);
      activeItemsRef.current = [];
      timeoutIdsRef.current.forEach(window.clearTimeout);
      return;
    }

    const getSettings = () =>
      Utils.getPlanetPopFeedViewportSettings(window.innerWidth);

    const pickImage = () => {
      if (!imagePoolRef.current.length) {
        imagePoolRef.current = Utils.refillImagePool(
          Config.PLANET_CANVAS_TRAIL_IMAGES.length,
          lastImageIndexRef.current,
        );
      }
      const idx = imagePoolRef.current.shift() ?? 0;
      lastImageIndexRef.current = idx;
      return Config.PLANET_CANVAS_TRAIL_IMAGES[idx];
    };

    const spawnFeedItem = () => {
      const settings = getSettings();
      if (activeItemsRef.current.length >= settings.maxVisibleItems) return;

      const theme = Utils.pickPopFeedTheme();
      const brand = Utils.pickRandomValue(Config.POP_FEED_BRANDS);
      const itemId = Helpers.createFeedItemId();
      const pos = Helpers.pickPosition(
        theme,
        settings.minDistance,
        activeItemsRef.current.map((i) => i.position),
      );

      const newItem = Helpers.buildFeedItem({
        itemId,
        bubbleId: `${itemId}-p`,
        theme,
        brand,
        image: pickImage(),
        appearanceDelayMs: 0,
        position: pos,
        message: Config.buildPopFeedBrandMessage(brand, theme),
      });

      setFeedItems((prev) => {
        const next = [...prev, newItem];
        activeItemsRef.current = next;
        return next;
      });

      const tid = window.setTimeout(() => {
        setFeedItems((prev) => {
          const next = prev.filter((i) => i.id !== itemId);
          activeItemsRef.current = next;
          return next;
        });
      }, Config.POP_FEED_LIFETIME_MS);
      timeoutIdsRef.current.push(tid);
    };

    const scheduleNext = (isFirst = false) => {
      const s = getSettings();
      const delay = isFirst
        ? Utils.getRandomBetween(s.firstSpawnDelayMin, s.firstSpawnDelayMax)
        : Utils.getRandomBetween(s.nextSpawnDelayMin, s.nextSpawnDelayMax);
      const tid = window.setTimeout(() => {
        spawnFeedItem();
        scheduleNext();
      }, delay);
      timeoutIdsRef.current.push(tid);
    };

    scheduleNext(true);
    return () => timeoutIdsRef.current.forEach(window.clearTimeout);
  }, [enabled]);

  return feedItems;
};

export default usePlanetPopFeed;
