import { getWeeklyImpact } from "@src/services/feedbackService";
import { useAuth } from "@src/services/AuthContext";
import type { FeedbackType } from "@src/types/Reports";
import { getFeedbackPath } from "@src/utils/brandSlug";
import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import "./HeroBanner.scss";
import AuthTooltip from "@src/components/shared/AuthTooltip";
import { useAuthTooltip } from "@src/hooks/useAuthTooltip";

type HeroBannerProps = {
  activeTab?: FeedbackType;
  onTabChange?: (tab: FeedbackType) => void;
  isMobile?: boolean;
};

const AUTH_TOOLTIP_MESSAGES: Record<FeedbackType, string> = {
  report: "Connecte-toi pour voir les signalements",
  coupdecoeur: "Connecte-toi pour voir les coups de cœur",
  suggestion: "Connecte-toi pour voir les suggestions",
};

const HeroBanner = ({
  activeTab,
  onTabChange,
  isMobile = false,
}: HeroBannerProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reports: 0,
    coupsDeCoeur: 0,
    suggestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showAuthTooltip, tooltipText, tooltipPosition, triggerTooltip } =
    useAuthTooltip();

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

  const statItems: {
    key: FeedbackType;
    value: number;
    icon: string;
    alt: string;
  }[] = [
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

  const handleStatClick = (
    tab: FeedbackType,
    event?: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!isAuthenticated) {
      triggerTooltip(AUTH_TOOLTIP_MESSAGES[tab], event);
      return;
    }

    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    navigate(getFeedbackPath(tab));
  };

  // SI MOBILE : On affiche le bandeau fin
  if (isMobile) {
    return (
      <div className="hero-banner-mobile">
        <p className="mobile-impact-text">
          L'impact de la communauté cette semaine
        </p>
        <div className="mobile-stats-row">
          {statItems.map((item) => (
            <button
              type="button"
              className="mobile-stat"
              key={item.key}
              onClick={(event) => handleStatClick(item.key, event)}
              aria-label={`Voir les ${item.alt.toLowerCase()}`}
            >
              <span className="value">{loading ? "..." : item.value}</span>
              <img src={item.icon} alt={item.alt} />
            </button>
          ))}
        </div>
        <AuthTooltip
          show={showAuthTooltip}
          text={tooltipText}
          position={tooltipPosition}
        />
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
              <button
                type="button"
                className="stat"
                key={item.key}
                onClick={(event) => handleStatClick(item.key, event)}
                aria-label={`Voir les ${item.alt.toLowerCase()}`}
              >
                <span className="stat-value">
                  {loading ? "..." : item.value}
                </span>
                <img src={item.icon} alt={item.alt} />
              </button>
            ))}
          </div>

          {activeTab !== undefined && onTabChange && (
            <div className="hero-tabs">
              {statItems.map((item) => (
                <button
                  key={item.key}
                  className={`hero-tab ${activeTab === item.key ? "is-active" : ""}`}
                  onClick={() => onTabChange(item.key as FeedbackType)}
                  aria-label={
                    item.key === "report"
                      ? "Signalements"
                      : item.key === "coupdecoeur"
                        ? "Coups de cœur"
                        : "Suggestions"
                  }
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
      <AuthTooltip
        show={showAuthTooltip}
        text={tooltipText}
        position={tooltipPosition}
      />
    </div>
  );
};

export default HeroBanner;
