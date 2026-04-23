import { useEffect, useState } from "react";
import {
  loadDefaultStats,
  loadSuggestionStats,
} from "../services/statsLoaders";

import type {
  RightSidebarStatItem,
  RightSidebarStatsMode,
} from "../right-sidebar/rightSidebarTypes";

export const useRightSidebarStats = (mode: RightSidebarStatsMode) => {
  const [stats, setStats] = useState<RightSidebarStatItem[]>([]);
  const [loading, setLoading] = useState(mode !== "none");

  useEffect(() => {
    let cancelled = false;

    if (mode === "none") {
      setStats([]);
      setLoading(false);

      return () => {
        cancelled = true;
      };
    }

    const load = async () => {
      setLoading(true);

      try {
        let data: RightSidebarStatItem[];

        if (mode.startsWith("suggestion")) {
          data = await loadSuggestionStats();
        } else {
          data = await loadDefaultStats();
        }

        if (!cancelled) setStats(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setStats([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  return { stats, loading };
};
