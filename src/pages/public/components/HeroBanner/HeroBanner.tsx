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
};

const HeroBanner = ({ activeTab, onTabChange }: HeroBannerProps) => {
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
        console.error("Erreur récupération stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const hasTabs = activeTab !== undefined && onTabChange !== undefined;
  const statItems: {
    key: FeedbackType;
    label: string;
    value: number;
    icon: string;
    alt: string;
  }[] = [
    {
      key: "report",
      label: "Signalements",
      value: stats.reports,
      icon: reportYellowIcon,
      alt: "Signalements",
    },
    {
      key: "coupdecoeur",
      label: "Coups de cœur",
      value: stats.coupsDeCoeur,
      icon: likeRedIcon,
      alt: "Coups de cœur",
    },
    {
      key: "suggestion",
      label: "Suggestions",
      value: stats.suggestions,
      icon: suggestGreenIcon,
      alt: "Suggestions",
    },
  ];

  return (
    <div className={`hero-banner${hasTabs ? " hero-banner--with-tabs" : ""}`}>
      <div className="hero-content">
        <div className="hero-left">
          <h1>
            <span className="highlight-container">
              <span className="highlight">Ensemble</span>
            </span>
            on fait
            <br />
            bouger les marques !
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

          {hasTabs && (
            <div className="hero-tabs">
              {statItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={activeTab === item.key}
                  className={`hero-tab${activeTab === item.key ? " is-active" : ""}`}
                  onClick={() => onTabChange(item.key)}
                >
                  {item.label}
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
