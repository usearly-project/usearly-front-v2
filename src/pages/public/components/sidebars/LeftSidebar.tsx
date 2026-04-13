import { useMemo } from "react";
import BrandsGrid from "./BrandsGrid";
import ReportSidebar from "./ReportSidebar";
import "./LeftSidebar.scss";
import type { FeedbackType } from "@src/types/Reports";
import cdcIcon from "/assets/icons/cdc-icon.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";

type FeedItem = { marque?: string; siteUrl?: string };

interface Props {
  activeTab?: FeedbackType;
  feedbackData?: FeedItem[];
}

function computeBrandStats(feedbackData: FeedItem[]) {
  const counts = new Map<
    string,
    { brandName: string; siteUrl: string; count: number }
  >();

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

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.brandName.localeCompare(b.brandName))
    .slice(0, 5);
}

const LeftSidebar = ({ activeTab, feedbackData = [] }: Props) => {
  const brandStats = useMemo(() => {
    if (activeTab !== "coupdecoeur" && activeTab !== "suggestion") return [];
    return computeBrandStats(feedbackData);
  }, [activeTab, feedbackData]);

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
