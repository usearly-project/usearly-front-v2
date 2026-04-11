import { getWeeklyImpact } from "@src/services/feedbackService";
import type { FeedbackType } from "@src/types/Reports";
import { useState, useEffect } from "react";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import "./HeroBanner.scss";

type HeroBannerProps = {
  activeTab?: FeedbackType;
  onTabChange?: (tab: FeedbackType) => void;
  isMobile?: boolean;
};

const HeroBanner = ({
  activeTab,
  onTabChange,
  isMobile = false,
}: HeroBannerProps) => {
  const [stats, setStats] = useState({
    reports: 0,
    coupsDeCoeur: 0,
    suggestions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWeeklyImpact();
        setStats(data);
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      key: "report",
      value: stats.reports,
      icon: reportYellowIcon,
      alt: "Signalements",
    },
    {
      key: "coupdecoeur",
      value: stats.coupsDeCoeur,
      icon: likeRedIcon,
      alt: "Coups de cœur",
    },
    {
      key: "suggestion",
      value: stats.suggestions,
      icon: suggestGreenIcon,
      alt: "Suggestions",
    },
  ];

  // SI MOBILE : On affiche le bandeau fin
  if (isMobile) {
    return (
      <div className="hero-banner-mobile">
        <p className="mobile-impact-text">
          L'impact de la communauté cette semaine :
        </p>
        <div className="mobile-stats-row">
          {statItems.map((item) => (
            <div className="mobile-stat" key={item.key}>
              <span className="value">{loading ? "..." : item.value}</span>
              <img src={item.icon} alt={item.alt} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SINON : On affiche le design Desktop normal
  return (
    <div
      className={`hero-banner ${activeTab !== undefined ? "hero-banner--with-tabs" : ""}`}
    >
      <div className="hero-content">
        <div className="hero-left">
          <h1>
            <span className="highlight-container">
              <span className="highlight">Ensemble</span>
            </span>
            on fait <br /> bouger les marques !
          </h1>
        </div>

        <div className="hero-right">
          <p className="hero-impact">
            L'impact de la communauté cette semaine :
          </p>
          <div className="hero-stats">
            {statItems.map((item) => (
              <div className="stat" key={item.key}>
                <span className="stat-value">
                  {loading ? "..." : item.value}
                </span>
                <img src={item.icon} alt={item.alt} />
              </div>
            ))}
          </div>

          {activeTab !== undefined && onTabChange && (
            <div className="hero-tabs">
              {statItems.map((item) => (
                <button
                  key={item.key}
                  className={`hero-tab ${activeTab === item.key ? "is-active" : ""}`}
                  onClick={() => onTabChange(item.key as FeedbackType)}
                >
                  {item.key === "report"
                    ? "Signalements"
                    : item.key === "coupdecoeur"
                      ? "Coups de cœur"
                      : "Suggestions"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
