import { useState, useEffect, useMemo } from "react";
import { getCommentsCountForDescription } from "@src/services/commentService";
import {
  getMostRecentDate,
  getUniqueSubCategories,
} from "../utils/HomeBrandBlock.utils";
import { useBrandResponsesMap } from "@src/hooks/useBrandResponsesMap";

export const useHomeBrandBlock = (brand: string, reports: any[]) => {
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>({});
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const uniqueSubCategories = useMemo(
    () => Object.values(getUniqueSubCategories(reports)),
    [reports],
  );
  const allReportIds = useMemo(
    () =>
      Array.from(
        new Set(uniqueSubCategories.flatMap((sub: any) => sub.reportIds)),
      ),
    [uniqueSubCategories],
  );
  const { brandResponsesMap } = useBrandResponsesMap(allReportIds);
  const mostRecentDate = useMemo(() => getMostRecentDate(reports), [reports]);

  const toggleBrand = (brandName: string) => {
    setOpenBrands((prev) => ({ ...prev, [brandName]: !prev[brandName] }));
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const newCounts: Record<string, number> = {};
      for (const report of reports) {
        for (const sub of report.subCategories) {
          for (const desc of sub.descriptions) {
            try {
              const res = await getCommentsCountForDescription(desc.id);
              newCounts[desc.id] = res.data.commentsCount ?? 0;
            } catch {
              newCounts[desc.id] = 0;
            }
          }
        }
      }
      setLocalCommentsCounts(newCounts);
    };
    fetchCounts();
  }, [reports]);

  return {
    isOpen: openBrands[brand],
    toggleBrand: () => toggleBrand(brand),
    uniqueSubCategories,
    mostRecentDate,
    localCommentsCounts,
    setLocalCommentsCounts,
    expandedSub,
    setExpandedSub,
    brandResponsesMap,
  };
};
