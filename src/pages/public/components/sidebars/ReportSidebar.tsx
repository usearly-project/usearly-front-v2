import { useEffect, useState } from "react";
import BrandProgressRow from "./BrandProgressRow";
import { getTrendingBrands } from "@src/services/feedbackService";
import BrandMobilizationSidebar from "./brand-mobilization-sidebar/BrandMobilizationSidebar";

type TrendingBrand = {
  brandName: string;
  siteUrl: string;
  count: number;
  progress: number;
  message: string;
};

type TooltipState = { visible: boolean; x: number; y: number; text: string };

// Props que ReportSidebar doit recevoir pour savoir s'il doit switcher
interface Props {
  selectedBrand?: string;
  selectedSiteUrl?: string;
  currentBrandStats?: {
    problemsCount: number;
  } | null;
}

function clampX(centerX: number, tooltipWidth: number, padding: number) {
  let x = centerX;
  if (x + tooltipWidth / 2 > window.innerWidth)
    x = window.innerWidth - tooltipWidth / 2 - padding;
  if (x - tooltipWidth / 2 < padding) x = tooltipWidth / 2 + padding;
  return x;
}

function ReportSidebar({
  selectedBrand,
  selectedSiteUrl,
  currentBrandStats,
}: Props) {
  const [reportBrands, setReportBrands] = useState<TrendingBrand[]>([]);
  const [reportLoading, setReportLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getTrendingBrands();
        setReportBrands(data);
      } catch (e) {
        console.error("Erreur trending brands:", e);
      } finally {
        setReportLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // --- LE SEUL AJOUT NÉCESSAIRE ---
  // Si on a une marque sélectionnée, on affiche TON composant et on s'arrête là.
  if (selectedBrand) {
    const count = currentBrandStats?.problemsCount || 0;
    return (
      <BrandMobilizationSidebar
        brandName={selectedBrand}
        siteUrl={selectedSiteUrl || ""}
        count={count}
        progress={(count / 30) * 100}
      />
    );
  }

  // --- TOUT TON CODE ORIGINAL INCHANGÉ ---
  const displayedBrands = showAll
    ? reportBrands.slice(0, 10)
    : reportBrands.slice(0, 3);

  const handleSeeAll = (e: React.MouseEvent) => {
    if (reportBrands.length <= 3) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = clampX(rect.left + rect.width / 2, 220, 12);
      setTooltip({
        visible: true,
        x,
        y: rect.top - 8,
        text: "Aucune autre marque ne nécessite d'action pour le moment",
      });
      setTimeout(
        () => setTooltip((prev) => ({ ...prev, visible: false })),
        2500,
      );
    } else {
      setShowAll((prev) => !prev);
    }
  };

  const handleHover = (e: React.MouseEvent, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clampX(rect.left + rect.width / 2, 180, 12);
    setTooltip({ visible: true, x, y: rect.top - 10, text });
  };

  const handleLeave = () => {
    setTimeout(() => setTooltip((prev) => ({ ...prev, visible: false })), 50);
  };

  return (
    <div className="left-sidebar">
      <h3>Les marques à faire réagir en ce moment!</h3>
      <div className="brands-list">
        {reportLoading ? (
          <p>Chargement...</p>
        ) : reportBrands.length === 0 ? (
          <p className="empty">Aucune marque à faire réagir pour le moment</p>
        ) : (
          displayedBrands.map((brand, index) => (
            <BrandProgressRow
              key={brand.siteUrl}
              name={brand.brandName}
              siteUrl={brand.siteUrl}
              progress={brand.progress}
              label={brand.message}
              count={brand.count}
              isTop={index === 0}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))
        )}
      </div>

      <div className="see-all-wrapper">
        <button
          className="see-all"
          onClick={handleSeeAll}
          aria-label={showAll ? "Voir moins" : "Voir toutes les marques"}
        >
          {showAll ? "Voir moins" : "Voir toutes les marques"}
        </button>
      </div>

      <p className="sidebar-text">
        Ces marques crispent beaucoup d'utilisateurs en ce moment.
      </p>
      <h1 className="sidebar-title">
        Signalez les bugs en ligne et faites bouger les marques !
      </h1>
      {tooltip.visible && (
        <div
          className="global-tooltip"
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -120%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

export default ReportSidebar;
