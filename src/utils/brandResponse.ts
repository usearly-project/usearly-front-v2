import { getBrandLogo } from "@src/utils/brandLogos";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import type {
  BrandAvatarData,
  HasBrandResponse,
} from "@src/types/brandResponse";

type BrandResponseSeed = {
  brand?: string | null;
  displayName?: string | null;
  siteUrl?: string | null;
  avatar?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  brandColor?: string | null;
  primaryColor?: string | null;
  color?: string | null;
};

const isBrandResponseObject = (
  value: unknown,
): value is Partial<HasBrandResponse> =>
  Boolean(
    value &&
    typeof value === "object" &&
    ("avatar" in value ||
      "pseudo" in value ||
      "displayName" in value ||
      "logoUrl" in value ||
      "imageUrl" in value ||
      "siteUrl" in value ||
      "type" in value ||
      "brandColor" in value ||
      "primaryColor" in value ||
      "color" in value),
  );

export const normalizeBrandResponse = (
  value: unknown,
  seed: BrandResponseSeed,
): HasBrandResponse => {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, any>;

  const message = data.message ?? data.content ?? data.response ?? null;

  if (!message) return null;

  const pseudo = data.pseudo ?? data.displayName ?? seed.brand ?? undefined;

  const siteUrl = data.siteUrl ?? seed.siteUrl ?? null;

  const avatar =
    data.avatar ??
    data.logoUrl ??
    data.imageUrl ??
    (pseudo ? getBrandLogo(pseudo, siteUrl ?? undefined) : null);

  const brandColor =
    data.brandColor ??
    data.primaryColor ??
    data.color ??
    (pseudo ? getBrandThemeColor(pseudo).base : null);

  return {
    type: "brand",
    brand: data.brand ?? seed.brand ?? "",
    siteUrl,
    message,
    createdAt: data.createdAt,

    avatar,
    pseudo,
    displayName: data.displayName,

    logoUrl: data.logoUrl,
    imageUrl: data.imageUrl,

    brandColor,
    primaryColor: data.primaryColor,
    color: data.color,
  };
};

export const getBrandAvatarFromResponse = (
  value: HasBrandResponse | undefined,
): BrandAvatarData | undefined => {
  if (!isBrandResponseObject(value)) return undefined;

  const data = value as BrandAvatarData;
  const resolvedPseudo = data.pseudo ?? data.displayName ?? undefined;
  const resolvedAvatar = data.avatar ?? data.logoUrl ?? data.imageUrl ?? null;

  if (resolvedPseudo !== data.pseudo || resolvedAvatar !== data.avatar) {
    return {
      ...data,
      pseudo: resolvedPseudo,
      avatar: resolvedAvatar,
    };
  }

  return data;
};
