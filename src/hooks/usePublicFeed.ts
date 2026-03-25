import { getPublicFeed } from "@src/services/feedbackService";
import type { FeedItem } from "@src/types/feedItem";
import type { CoupDeCoeur, PublicReport, Suggestion } from "@src/types/Reports";
import { useState, useEffect, useRef } from "react";

type PublicFeedRecord =
  | (PublicReport & { type: "report" })
  | (Omit<CoupDeCoeur, "type"> & { type: "cdc" })
  | (Omit<Suggestion, "type"> & { type: "suggestion" });

type PublicFeedResponse = {
  data: PublicFeedRecord[];
  nextCursor?: string | null;
};

export const usePublicFeed = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false); // 🔥 fix

  const loadingRef = useRef(false);

  const loadFeed = async () => {
    if (loadingRef.current || (!hasMore && cursor !== null)) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = (await getPublicFeed(
        30,
        cursor || undefined,
      )) as PublicFeedResponse;

      const items: FeedItem[] = res.data.map((item) => {
        if (item.type === "report") {
          return { type: "report", data: item };
        }

        if (item.type === "cdc") {
          return {
            type: "cdc",
            data: {
              ...item,
              type: "coupdecoeur",
            },
          };
        }

        return {
          type: "suggestion",
          data: {
            ...item,
            type: "suggestion",
          },
        };
      });

      setFeed((prev) => {
        const ids = new Set(
          prev.map((i) =>
            i.type === "report" ? i.data.reportingId : i.data.id,
          ),
        );

        const filtered = items.filter((i) => {
          const id = i.type === "report" ? i.data.reportingId : i.data.id;
          return !ids.has(id);
        });

        return [...prev, ...filtered];
      });

      // 🔥 gestion cursor clean
      setCursor(res.nextCursor || null);
      setHasMore(!!res.nextCursor);
    } catch (err) {
      console.error("❌ loadFeed error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return {
    feed,
    loadMore: loadFeed,
    loading,
    hasMore,
  };
};
