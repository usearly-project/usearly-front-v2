import { useEffect, useState } from "react";
import { getConfirmedSubcategoryReports } from "@src/services/feedbackService";
import type {
  ConfirmedSubcategoryReport,
  FeedbackDescription,
  ExplodedGroupedReport,
} from "@src/types/Reports";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

export const useConfirmedFlatData = () => {
  const [data, setData] = useState<ExplodedGroupedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getConfirmedSubcategoryReports(1, 100);

        const formatted: ExplodedGroupedReport[] = res.data.map(
          (item: ConfirmedSubcategoryReport) => {
            const descriptions: FeedbackDescription[] = item.descriptions.map(
              (desc: any, i) => ({
                id: String(desc.id),
                reportingId: String(item.reportingId),
                description: desc.description,
                emoji: desc.emoji ?? "",
                createdAt: desc.createdAt,
                author: {
                  id: String(desc.user.id),
                  pseudo: desc.user.pseudo,
                  avatar: desc.user.avatar ?? null,
                  email: desc.user.email,
                },
                capture: i === 0 ? item.capture : null,
                marque: item.marque,
                reactions: [],
              }),
            );

            const rawBrandResponse = item.hasBrandResponse;

            const normalizedBrandResponse =
              rawBrandResponse &&
              typeof rawBrandResponse === "object" &&
              ("message" in rawBrandResponse ||
                "content" in rawBrandResponse ||
                "response" in rawBrandResponse)
                ? normalizeBrandResponse(rawBrandResponse, {
                    brand: item.marque,
                    siteUrl: item.siteUrl ?? null,
                  })
                : undefined;
            console.log(
              "STEP 2 NORMALIZED useConfirmedFlatData 👉",
              normalizedBrandResponse,
            );

            console.log("STEP 1 BACK RAW 👉", item.hasBrandResponse);
            return {
              id: String(item.reportingId),
              reportingId: String(item.reportingId),
              category: item.category,
              marque: item.marque,
              siteUrl: item.siteUrl ?? undefined,
              totalCount: item.count,
              hasBrandResponse: rawBrandResponse,
              reactions: [],
              subCategories: [
                {
                  subCategory: item.subCategory,
                  count: item.count,
                  status: item.status,
                  descriptions,
                },
              ],
              subCategory: {
                subCategory: item.subCategory,
                count: item.count,
                status: item.status,
                descriptions,
              },
            };
          },
        );

        setData(formatted);
      } catch (err) {
        console.error("❌ useConfirmedFlatData failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { data, loading };
};
