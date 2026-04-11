import type { FeedItem } from "@src/types/feedItem";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import PopularReportCard from "../report-grouped/reports-popular/PopularReportCard";
import { getBrandLogo } from "@src/utils/brandLogos";
import { normalizeBrandResponse } from "@src/utils/brandResponse";
import MobileActu from "../mobile/actu/MobileActu";

interface Props {
  item: FeedItem;
  isOpen: boolean;
  isPublic?: boolean;
  isMobile?: boolean; // <--- On ajoute la prop ici
}

function FeedItemRenderer({
  item,
  isOpen,
  isPublic = false,
  isMobile = false,
}: Props) {
  // 1. Logique commune de préparation des données (Adaptation Report)
  let adaptedReport: any = null;

  if (item.type === "report") {
    const raw = item.data.hasBrandResponse;
    let finalBrandResponse = null;

    if (raw) {
      const enrichedRaw = {
        ...raw,
        avatar: getBrandLogo(item.data.marque, item.data.siteUrl ?? undefined),
      };

      const normalized = normalizeBrandResponse(enrichedRaw, {
        brand: item.data.marque,
        siteUrl: item.data.siteUrl ?? null,
        avatar: enrichedRaw.avatar,
      });

      if (normalized && typeof normalized === "object") {
        finalBrandResponse = {
          ...normalized,
          message: raw.message,
          createdAt: raw.createdAt,
        };
      }
    }

    adaptedReport = {
      reportingId: item.data.reportingId,
      marque: item.data.marque,
      siteUrl: item.data.siteUrl,
      subCategory: item.data.subCategory,
      status: "open",
      count: item.data.reportsCount,
      solutionsCount: item.data.solutionsCount,
      hasBrandResponse: finalBrandResponse,
      descriptions: [
        {
          id: item.data.descriptionId,
          description: item.data.description,
          emoji: item.data.emoji,
          createdAt: item.data.latestActivityAt || item.data.createdAt,
          capture: item.data.capture ?? null,
          author: item.data.author,
          reactions: [],
          comments: [],
        },
        ...(item.data.reporters ?? []).map((r: any) => ({
          id: r.descriptionId,
          description: r.description,
          emoji: r.emoji,
          createdAt: r.createdAt,
          capture: null,
          author: { id: r.id, pseudo: r.pseudo, avatar: r.avatar },
          reactions: [],
          comments: [],
        })),
      ],
    };
  }

  // 2. LE SWITCH MOBILE : Si on est sur mobile, on utilise le composant unique
  if (isMobile) {
    return (
      <MobileActu
        item={item.type === "report" ? adaptedReport : item.data}
        type={item.type}
        isPublic={isPublic}
      />
    );
  }

  // 3. RENDU DESKTOP HABITUEL (Ton code d'origine)
  if (item.type === "report") {
    return (
      <PopularReportCard
        item={adaptedReport}
        isOpen={isOpen}
        isPublic={isPublic}
        onOpenSolutionModal={() => {}}
      />
    );
  }

  if (item.type === "suggestion") {
    return (
      <InteractiveFeedbackCard
        item={
          {
            ...item.data,
            type: "suggestion",
          } as any
        } // Le "as any" est radical, mais "as Suggestion" serait mieux si tu as l'import
        isOpen={isOpen}
        showHeaderTypeIcon
      />
    );
  }

  if (item.type === "cdc") {
    return (
      <InteractiveFeedbackCard
        item={
          {
            ...item.data,
            type: "coupdecoeur",
          } as any
        }
        isOpen={isOpen}
        showHeaderTypeIcon
      />
    );
  }

  return null;
}

export default FeedItemRenderer;
