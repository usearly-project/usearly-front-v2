import React, { useState } from "react";
import "./BrandResponseBanner.scss";
import type { HasBrandResponse } from "@src/types/brandResponse";
import ampoule from "/assets/svg/ampoule-bw.svg";
import { useAuth } from "@src/services/AuthContext";

type Props = {
  message: string;
  createdAt?: string;
  brand: string;
  brandSiteUrl?: string;
  brandResponse?: HasBrandResponse;
};

const BrandResponseBanner: React.FC<Props> = ({ message, createdAt }) => {
  const { userProfile } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const MAX_LENGTH = 140;
  const isLong = message.length > MAX_LENGTH;

  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };
  return (
    <div className="brand-response-banner">
      <div className="brand-response-header">
        <img src={ampoule} className="icon" alt="" />

        <span className="title">Réponse de la marque</span>

        {createdAt && (
          <span className="date">
            {" "}
            · {new Date(createdAt).toLocaleDateString()} (
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            )
          </span>
        )}
      </div>

      <p className="brand-response-message">
        {expanded ? message : message.slice(0, MAX_LENGTH)}
        {!expanded && isLong && "..."}

        {isLong && (
          <span
            className="see-more-inline"
            onClick={(e) => {
              e.stopPropagation();

              if (!userProfile?.id && !expanded) {
                triggerTooltip("Connecte-toi pour voir la réponse complète");
                return;
              }

              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? " Voir moins" : " Voir plus"}
          </span>
        )}
      </p>

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default BrandResponseBanner;
