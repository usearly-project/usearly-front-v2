export type BrandAvatarData = {
  avatar: string | null;
  pseudo?: string;
  displayName?: string;
  type: "brand";
  siteUrl?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  brandColor?: string | null;
  primaryColor?: string | null;
  color?: string | null;
};

export type HasBrandResponse = null | {
  type: "brand";

  // 🔥 backend
  brand: string;
  siteUrl?: string | null;
  message: string; // ✅ IMPORTANT : plus optionnel

  createdAt?: string;

  // 🔥 compat legacy (si jamais)
  content?: string;
  response?: string;

  // 🔥 UI enrichi (fusion avec BrandAvatarData)
  avatar?: string | null;
  pseudo?: string;
  displayName?: string;

  logoUrl?: string | null;
  imageUrl?: string | null;

  brandColor?: string | null;
  primaryColor?: string | null;
  color?: string | null;
};

export type BrandResponse = {
  message: string;
  createdAt?: string;
  brandName?: string;
  siteUrl?: string | null;
  avatar?: string | null;
  type?: "brand";
};

export type BrandResponseData = {
  message?: string;
  content?: string;
  response?: string;
  createdAt?: string;
  brandName?: string;
  siteUrl?: string;
};
