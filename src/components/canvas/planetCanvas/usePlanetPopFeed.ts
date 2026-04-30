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
      timeoutIdsRef.current = [];
      return;
    }

    const getSettings = () =>
      Utils.getPlanetPopFeedViewportSettings(window.innerWidth);

    const pickImage = () => {
      const activeImages = new Set(activeItemsRef.current.map((i) => i.image));
      // Filter out images already visible
      imagePoolRef.current = imagePoolRef.current.filter(
        (idx) => !activeImages.has(Config.PLANET_CANVAS_TRAIL_IMAGES[idx]),
      );
      if (!imagePoolRef.current.length) {
        imagePoolRef.current = Utils.refillImagePool(
          Config.PLANET_CANVAS_TRAIL_IMAGES.length,
          lastImageIndexRef.current,
        ).filter(
          (idx) => !activeImages.has(Config.PLANET_CANVAS_TRAIL_IMAGES[idx]),
        );
      }
      const idx = imagePoolRef.current.shift() ?? 0;
      lastImageIndexRef.current = idx;
      return Config.PLANET_CANVAS_TRAIL_IMAGES[idx];
    };

    const spawnFeedItem = () => {
      const settings = getSettings();
      if (activeItemsRef.current.length >= settings.maxVisibleItems) return;

      const activeThemes = new Set(activeItemsRef.current.map((i) => i.theme));
      const preferredTheme = Utils.pickPopFeedTheme();
      // Build a set of themes to exclude: non-report themes already on screen
      const excludeThemes = new Set(
        [...activeThemes].filter((t) => t !== "report"),
      );

      const activeBrandIds = new Set(
        activeItemsRef.current.map((i) => i.brandId),
      );
      const availableBrands = Config.POP_FEED_BRANDS.filter(
        (b) => !activeBrandIds.has(b.id),
      );
      if (availableBrands.length === 0) return;
      const compatibleBrands = availableBrands
        .map((brand) => ({
          brand,
          content: Config.resolvePopFeedBrandContent(brand, preferredTheme, {
            excludeThemes,
          }),
        }))
        .filter(
          (
            entry,
          ): entry is {
            brand: (typeof availableBrands)[number];
            content: NonNullable<
              ReturnType<typeof Config.resolvePopFeedBrandContent>
            >;
          } => entry.content !== undefined,
        );

      if (!compatibleBrands.length) return;

      const { brand, content: popFeedContent } =
        Utils.pickRandomValue(compatibleBrands);

      const { theme, message } = popFeedContent;
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
        message,
      });

      // Désactivé : on ne veut plus afficher de report "linked" en doublon.
      // const linkedMessage =
      //   theme === "report"
      //     ? Config.buildPopFeedBrandMessage(brand, "report", { linked: true })
      //     : undefined;
      const linkedMessage: string | undefined = undefined;
      const linkedItemId = linkedMessage ? Helpers.createFeedItemId() : null;
      const linkedItem =
        linkedMessage && linkedItemId
          ? Helpers.buildFeedItem({
              itemId: linkedItemId,
              bubbleId: `${linkedItemId}-p`,
              theme: "report",
              brand,
              image: pickImage(),
              appearanceDelayMs: 180,
              position: Helpers.pickRelatedReportPosition(
                pos,
                settings.minDistance,
                settings.reportPairMinOffset,
                settings.reportVerticalRange,
                activeItemsRef.current.map((i) => i.position),
              ),
              message: linkedMessage,
            })
          : null;
      const newItems = linkedItem ? [newItem, linkedItem] : [newItem];
      const newItemIds = newItems.map((item) => item.id);

      setFeedItems((prev) => {
        const next = [...prev, ...newItems];
        activeItemsRef.current = next;
        return next;
      });

      const tid = window.setTimeout(() => {
        const remaining = activeItemsRef.current.filter(
          (i) => !newItemIds.includes(i.id),
        );
        activeItemsRef.current = remaining;
        setFeedItems(remaining);

        if (remaining.length === 0) {
          const refillTid = window.setTimeout(spawnFeedItem, 120);
          timeoutIdsRef.current.push(refillTid);
        }
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
    return () => {
      timeoutIdsRef.current.forEach(window.clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, [enabled]);

  return feedItems;
};

export default usePlanetPopFeed;
