import type { FeedbackType } from "@src/types/Reports";

type BrandEntry =
  | string
  | {
      marque?: string;
      brand?: string;
      name?: string;
      siteUrl?: string;
    };

export type ResolvedBrandSlug = {
  marque: string;
  siteUrl?: string;
};

export const toBrandSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getBrandName = (entry: BrandEntry) => {
  if (typeof entry === "string") return entry;
  return entry.marque || entry.brand || entry.name || "";
};

const getBrandSiteUrl = (entry: BrandEntry) =>
  typeof entry === "string" ? undefined : entry.siteUrl;

export const findBrandBySlug = (
  brands: BrandEntry[],
  slug: string,
): ResolvedBrandSlug | null => {
  const normalizedSlug = toBrandSlug(slug);
  if (!normalizedSlug) return null;

  const match = brands.find((entry) => {
    const name = getBrandName(entry);
    return Boolean(name) && toBrandSlug(name) === normalizedSlug;
  });

  if (!match) return null;

  const marque = getBrandName(match).trim();
  if (!marque) return null;

  return {
    marque,
    siteUrl: getBrandSiteUrl(match),
  };
};

export const uniqueBrandsBySlug = (
  brands: BrandEntry[],
): ResolvedBrandSlug[] => {
  const seen = new Set<string>();
  const unique: ResolvedBrandSlug[] = [];

  brands.forEach((entry) => {
    const marque = getBrandName(entry).trim();
    const slug = toBrandSlug(marque);
    if (!slug || seen.has(slug)) return;

    seen.add(slug);
    unique.push({
      marque,
      siteUrl: getBrandSiteUrl(entry),
    });
  });

  return unique;
};

export const getFeedbackPath = (tab: FeedbackType) =>
  tab === "report" ? "/feedback" : `/feedback?tab=${tab}`;

export const getFeedbackBrandPath = (brand: string, tab: FeedbackType) => {
  const slug = toBrandSlug(brand);
  const tabQuery = tab === "report" ? "" : `?tab=${tab}`;
  return `/feedback/${slug}${tabQuery}`;
};
