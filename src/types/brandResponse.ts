export type BrandAvatarData = {
  avatar: string | null;
  pseudo?: string;
  brand?: string;
  displayName?: string;
  type: "brand";
  siteUrl?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  brandColor?: string | null;
  primaryColor?: string | null;
  color?: string | null;
  message?: string | null;
  createdAt?: string | null;
};

export type HasBrandResponse = boolean | BrandAvatarData;
