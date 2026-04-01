import Avatar from "../shared/Avatar";
import { truncate } from "@src/utils/stringUtils";

export const BRAND_AVATAR_SIZE = 25;
export const BRAND_AVATAR_SIZE_OPTION = 35;

export const getDisplayLabel = (
  label: string | undefined,
  isBrandSelect: boolean,
) => {
  const text = label ?? "";
  return isBrandSelect ? truncate(text, 20) : text;
};

export const renderLeadingVisual = (opt?: any) => {
  if (!opt) return null;
  if (opt.IconComponent) {
    const Icon = opt.IconComponent;
    return (
      <span className="select-filter-icon select-filter-icon--lucide">
        <Icon size={18} />
      </span>
    );
  }
  if (opt.emoji)
    return <span className="select-filter-emoji">{opt.emoji}</span>;
  if (opt.iconUrl)
    return (
      <span className="select-filter-icon select-filter-icon--image">
        <img src={opt.iconUrl} alt={opt.label} loading="lazy" />
      </span>
    );

  const fallback = (opt.iconFallback ?? opt.label ?? "")
    .trim()
    .slice(0, 2)
    .toUpperCase();
  return fallback ? (
    <span className="select-filter-icon select-filter-icon--fallback">
      {fallback}
    </span>
  ) : null;
};

export const renderBrandAvatar = (
  opt?: any,
  size = 32,
  extraClass = "",
  preferLogo = true,
  fallbackInitial?: string,
) => {
  if (!opt) return null;
  return (
    <Avatar
      avatar={null as any}
      pseudo={opt.label || "Marque"}
      type="brand"
      siteUrl={opt.siteUrl}
      preferBrandLogo={preferLogo}
      wrapperClassName={["brand-logo", extraClass].filter(Boolean).join(" ")}
      sizeHW={size}
      fallbackInitial={fallbackInitial}
    />
  );
};
