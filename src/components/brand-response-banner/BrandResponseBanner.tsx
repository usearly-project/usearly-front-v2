import React, { useMemo } from "react";
import "./BrandResponseBanner.scss";
import { differenceInCalendarDays } from "date-fns";
import type { HasBrandResponse } from "@src/types/brandResponse";
import { getBrandAvatarFromResponse } from "@src/utils/brandResponse";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import ampoule from "/assets/svg/ampoule-bw.svg";

type Props = {
  message: string;
  createdAt?: string;
  brand: string;
  brandSiteUrl?: string;
  brandResponse?: HasBrandResponse;
};

const NEUTRAL_BANNER_BG = "#f8fafc";

const BrandResponseBanner: React.FC<Props> = ({
  message,
  brand,
  createdAt,
  brandResponse,
}) => {
  const brandAvatar = getBrandAvatarFromResponse(brandResponse);
  const resolvedBrandName =
    brandAvatar?.pseudo ?? brandAvatar?.displayName ?? brand;
  const resolvedBrandColor = useMemo(() => {
    const candidate =
      brandAvatar?.brandColor ??
      brandAvatar?.primaryColor ??
      brandAvatar?.color ??
      undefined;

    if (candidate) return candidate;
    if (resolvedBrandName) return getBrandThemeColor(resolvedBrandName).base;
    return undefined;
  }, [
    brandAvatar?.brandColor,
    brandAvatar?.primaryColor,
    brandAvatar?.color,
    resolvedBrandName,
  ]);

  const bannerStyle = useMemo<React.CSSProperties>(() => {
    if (!resolvedBrandColor) {
      return { background: NEUTRAL_BANNER_BG };
    }

    const tintStrong = `color-mix(in srgb, ${resolvedBrandColor} 14%, white)`;

    return {
      background: `${tintStrong}`,
      ["--brand-accent" as any]: resolvedBrandColor,
    };
  }, [resolvedBrandColor]);

  const updatedLabel = useMemo(() => {
    if (!createdAt) return null;
    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) return null;
    const days = Math.max(0, differenceInCalendarDays(new Date(), createdDate));
    return `Dernière mise à jour il y a ${days} j`;
  }, [createdAt]);

  return (
    <div className="brand-response-banner-wrapper">
      {/* <Avatar
        avatar={brandAvatar?.avatar || fallbackLogo}
        pseudo={resolvedBrandName}
        type="brand"
        siteUrl={resolvedSiteUrl}
        sizeHW={32}
        className="brand-response-avatar"
        wrapperClassName="brand-response-avatar-wrapper"
      /> */}
      <div className="brand-response-banner-content">
        <div className="brand-response-banner" style={bannerStyle}>
          <div className="brand-response-banner-header">
            <img
              className="icon-brand-answer"
              src={ampoule}
              alt="icon brand answer"
            />
            <h2>
              <strong> Réponse de la marque</strong>
              {" •"}
              {updatedLabel && (
                <span className="date maj-date">{updatedLabel}</span>
              )}
            </h2>
          </div>
          <p className="brand-response-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandResponseBanner;
