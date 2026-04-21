import { useEffect, useState, useRef } from "react";
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
  const [loading, setLoading] = useState(true);

  const lastMode = useRef<RightSidebarStatsMode | null>(null); // ✅ AJOUT

  useEffect(() => {
    let cancelled = false;

    // ✅ évite les appels inutiles
    if (lastMode.current === mode) return;
    lastMode.current = mode;

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
