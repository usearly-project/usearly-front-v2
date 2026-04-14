import { useEffect, useMemo, useState } from "react";
import BrandsGrid from "./BrandsGrid";
import ReportSidebar from "./ReportSidebar";
import "./LeftSidebar.scss";
import type { FeedbackType } from "@src/types/Reports";
import cdcIcon from "/assets/icons/cdc-icon.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";
import { getAllBrandsCdc } from "@src/services/coupDeCoeurService";
import { getAllBrandsSuggestion } from "@src/services/suggestionService";
import { normalizeDomain } from "@src/utils/brandLogos";

type FeedItem = { marque?: string; siteUrl?: string };
type BrandStat = { brandName: string; siteUrl: string; count: number };

interface Props {
  activeTab?: FeedbackType;
  feedbackData?: FeedItem[];
}

const getBrandName = (item: unknown) => {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  const entry = item as Record<string, unknown>;
  return String(entry.marque || entry.brand || entry.name || "").trim();
};

const getBrandSiteUrl = (item: unknown, brandName: string) => {
  if (!item || typeof item !== "object") return "";

  const entry = item as Record<string, unknown>;
  const rawUrl = String(entry.siteUrl || entry.domain || entry.url || "");
  return normalizeDomain(rawUrl) || (brandName ? `${brandName}.com` : "");
};

const getBrandCount = (item: unknown) => {
  if (!item || typeof item !== "object") return 1;

  const entry = item as Record<string, unknown>;
  const rawCount =
    entry.count ??
    entry.total ??
    entry.totalCount ??
    entry.feedbackCount ??
    entry.coupDeCoeurCount ??
    entry.coupdecoeurCount ??
    entry.coupsDeCoeurCount ??
    entry.suggestionCount ??
    entry.suggestionsCount;

  const count = Number(rawCount);
  return Number.isFinite(count) && count > 0 ? count : 1;
};

function sortAndLimitBrandStats(counts: Map<string, BrandStat>) {
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.brandName.localeCompare(b.brandName))
    .slice(0, 5);
}

function computeBrandStats(feedbackData: FeedItem[]) {
  const counts = new Map<string, BrandStat>();

  for (const item of feedbackData) {
    const key = (item.marque || "").toLowerCase().trim();
    if (!key) continue;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, {
        brandName: item.marque!,
        siteUrl: item.siteUrl || "",
        count: 1,
      });
    }
  }

  return sortAndLimitBrandStats(counts);
}

function computeBrandStatsFromApi(items: unknown[]) {
  const counts = new Map<string, BrandStat>();

  for (const item of items) {
    const brandName = getBrandName(item);
    const key = brandName.toLowerCase().trim();
    if (!key) continue;

    const existing = counts.get(key);
    if (existing) {
      existing.count += getBrandCount(item);
      if (!existing.siteUrl) {
        existing.siteUrl = getBrandSiteUrl(item, brandName);
      }
    } else {
      counts.set(key, {
        brandName,
        siteUrl: getBrandSiteUrl(item, brandName),
        count: getBrandCount(item),
      });
    }
  }

  return sortAndLimitBrandStats(counts);
}

function useLeftSidebarBrandStats(activeTab?: FeedbackType) {
  const [brandStats, setBrandStats] = useState<BrandStat[]>([]);

  useEffect(() => {
    if (activeTab !== "coupdecoeur" && activeTab !== "suggestion") {
      setBrandStats([]);
      return;
    }

    let cancelled = false;

    const fetchBrandStats = async () => {
      try {
        const data =
          activeTab === "coupdecoeur"
            ? await getAllBrandsCdc()
            : await getAllBrandsSuggestion();

        if (!cancelled) {
          setBrandStats(
            computeBrandStatsFromApi(Array.isArray(data) ? data : []),
          );
        }
      } catch (error) {
        console.error("Erreur chargement stats marques nav gauche:", error);
        if (!cancelled) setBrandStats([]);
      }
    };

    fetchBrandStats();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return brandStats;
}

const LeftSidebar = ({ activeTab, feedbackData = [] }: Props) => {
  const apiBrandStats = useLeftSidebarBrandStats(activeTab);
  const brandStats = useMemo(() => {
    if (activeTab !== "coupdecoeur" && activeTab !== "suggestion") return [];
    if (apiBrandStats.length > 0) return apiBrandStats;
    return computeBrandStats(feedbackData);
  }, [activeTab, apiBrandStats, feedbackData]);

  if (activeTab === "suggestion") {
    return (
      <div className="left-sidebar">
        <h3>
          Les marques qui vous <img src={suggestIcon} alt="" /> inspirent en ce
          moment !
        </h3>
        <BrandsGrid brands={brandStats} />
        <p className="sidebar-text">
          Ces marques génèrent le plus de{" "}
          <strong>soutien de la communauté</strong> en ce moment.
          <br />
          Toi aussi exprime ta créativité et améliore tes sites et apps préférés
          !
        </p>
      </div>
    );
  }

  if (activeTab === "coupdecoeur") {
    return (
      <div className="left-sidebar">
        <h3>
          Les marques qui font battre votre
          <img src={cdcIcon} alt="icon coeur" /> en ce moment !
        </h3>
        <BrandsGrid brands={brandStats} />
        <p className="sidebar-text">
          <strong>Ces marques génèrent beaucoup d'amour</strong> auprès des
          utilisateurs en ce moment.
          <br />
          Toi aussi exprime ton amour aux marques qui te facilitent la vie !
        </p>
      </div>
    );
  }

  return <ReportSidebar />;
};

export default LeftSidebar;
