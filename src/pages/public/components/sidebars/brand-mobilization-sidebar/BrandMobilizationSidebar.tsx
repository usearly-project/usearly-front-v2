import React from "react";
import { Check, BadgeCheck } from "lucide-react";
import "./BrandMobilizationSidebar.scss";
import signalIconWhite from "/assets/icons/signal-icon-thin.svg";
// import commentaireIconColor from "/assets/icons/commentaire-icon-color.svg";
import commentaireIconColor from "/assets/icons/commentaire-icon.png";

interface Props {
  brandName: string;
  siteUrl: string;
  count: number;
  progress: number;
}

const STEP1_THRESHOLD = 3;
const STEP2_THRESHOLD = 30;

const BrandMobilizationSidebar: React.FC<Props> = ({
  brandName,
  siteUrl,
  count,
  progress,
}) => {
  return (
    <div className="mobilization-card">
      {/* HEADER DANS LA CARTE */}
      <div className="mobilization-card__header">
        <div className="mobilization-card__icon">
          <img
            src={commentaireIconColor}
            className="mobilization-card__icon-image"
            alt="commentaire icon"
          />
        </div>
        <h2>On en est où ?</h2>
      </div>

      {/* CADRE NOIR INTERNE */}
      <div className="mobilization-card__frame">
        {/* TOP */}
        {/* TOP SECTION RESTRUCTURÉE */}
        <div className="mobilization-card__top-section">
          {/* Ligne du haut : Texte et Ratio */}
          <div className="mobilization-card__text-row">
            <span>La mobilisation grandit</span>
          </div>

          {/* Ligne du bas : Logo + Progress Bar alignés */}
          <div className="mobilization-card__progress-row">
            <div className="mobilization-card__logo">
              <img
                src={`https://www.google.com/s2/favicons?domain=${siteUrl}&sz=128`}
                alt={brandName}
              />
            </div>
            <div className="mobilization-card__bar">
              <div
                className="mobilization-card__fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="mobilization-card__ratio">
              {count}
              <strong>/30</strong>
            </span>
          </div>
        </div>

        {/* BULLE */}
        <div className="mobilization-card__bubble">
          <strong>{count}</strong>
          <span>Signalements</span>
          <img
            src={signalIconWhite}
            width={22}
            height={22}
            alt="icon signalement"
          />
        </div>

        {/* TIMELINE */}
        <div className="mobilization-card__timeline">
          <TimelineStep
            isFirst
            active={count < STEP1_THRESHOLD}
            done={true}
            lineActive={count >= STEP1_THRESHOLD}
            title="Mobilisation en cours 🔥"
            desc="Encore quelques signalements pour alerter la marque"
          />
          <TimelineStep
            active={count >= STEP1_THRESHOLD && count < STEP2_THRESHOLD}
            done={count >= STEP1_THRESHOLD}
            lineActive={count >= STEP2_THRESHOLD}
            title="Marque alertée"
            desc="La communauté alerte la marque une fois le seuil atteint"
          />
          <TimelineStep
            active={count >= STEP2_THRESHOLD}
            done={count >= STEP2_THRESHOLD}
            title={
              <div className="timeline-step__title-container">
                Marque partenaire
                <BadgeCheck
                  size={18}
                  className={`certified-badge ${count >= STEP2_THRESHOLD ? "is-certified" : ""}`}
                />
              </div>
            }
            desc="La marque répond et agit aux côtés de la communauté"
            isLast
          />
        </div>
      </div>
    </div>
  );
};

interface TimelineStepProps {
  active: boolean;
  done: boolean;
  lineActive?: boolean;
  title: React.ReactNode;
  desc: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const TimelineStep = ({
  active,
  done,
  lineActive,
  title,
  desc,
  isLast,
}: TimelineStepProps) => (
  <div
    className={`timeline-step ${active ? "active" : ""} ${done ? "done" : ""}`}
  >
    <div className="timeline-step__left">
      <div className="timeline-step__node">
        {(done || active) && <Check size={12} strokeWidth={3} />}
      </div>
      {!isLast && (
        <div
          className={`timeline-step__line ${lineActive ? "timeline-step__line--active" : ""}`}
        />
      )}
    </div>

    <div className="timeline-step__content">
      <div className="timeline-step__title">{title}</div>
      <div className="timeline-step__desc">{desc}</div>
    </div>
  </div>
);

export default BrandMobilizationSidebar;
