import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UserProfilePage.scss";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
import UserEmotionSummaryPanel from "../profile/banner/user-emotion/UserEmotionSummaryPanel";
import { useUserEmotionSummary } from "../profile/hook/userEmotionService";
import UserProfileBanner from "./banner/UserProfileBanner";
import UserLoveBrandsPanel from "../profile/banner/user-emotion/UserLoveBrandsPanel";
import { useIsMobile } from "@src/hooks/use-mobile";
import Abracadabra from "/assets/images/profil/Abracadabra.svg";
import { useFetchUserFeedback } from "@src/hooks/useFetchUserFeedback";
import type { FeedbackType, Suggestion } from "@src/types/Reports";

type LoveBrand = React.ComponentProps<
  typeof UserLoveBrandsPanel
>["brands"][number];

const normalizeBrandKey = (value?: string) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const buildSuggestionBrands = (items: Suggestion[]): LoveBrand[] => {
  const brands = new Map<string, LoveBrand>();

  items.forEach((item) => {
    const name = item.marque?.trim();
    if (!name) return;

    const key = normalizeBrandKey(name);
    const existing = brands.get(key);

    if (existing) {
      existing.count += 1;

      if (!existing.domain && item.siteUrl) {
        existing.domain = item.siteUrl;
      }

      return;
    }

    brands.set(key, {
      id: key,
      name,
      domain: item.siteUrl ?? "",
      logo: null,
      count: 1,
    });
  });

  return Array.from(brands.values()).sort(
    (a, b) =>
      b.count - a.count ||
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
  );
};

const getEmotionSummaryType = (
  activeTab: FeedbackType,
): "report" | "coupdecoeur" | null =>
  activeTab === "report" || activeTab === "coupdecoeur" ? activeTab : null;

const getSuggestionFetchTab = (activeTab: FeedbackType): FeedbackType =>
  activeTab === "suggestion" ? "suggestion" : "report";

const getLoveBrandsTitle = (activeTab: FeedbackType) => {
  if (activeTab === "report") return "Marques signalées";
  if (activeTab === "suggestion") return "Marques inspirantes";
  return undefined;
};

const PROFILE_TITLES: Record<
  FeedbackType,
  { title: string; subtitle?: string }
> = {
  report: { title: "Mes signalements", subtitle: "& émotions" },
  coupdecoeur: { title: "Mes coups de cœur", subtitle: "& émotions" },
  suggestion: { title: "Mes suggestions", subtitle: "& mes votes" },
};

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const isMobile = useIsMobile("(max-width: 1350px)");
  const isSuggestionTab = activeTab === "suggestion";
  const { title, subtitle } = PROFILE_TITLES[activeTab];
  const { data: emotionSummary, loading: loadingEmotionSummary } =
    useUserEmotionSummary(getEmotionSummaryType(activeTab));
  const { data: suggestionFeedback } = useFetchUserFeedback(
    getSuggestionFetchTab(activeTab),
  );
  const suggestionBrands = useMemo(
    () => buildSuggestionBrands((suggestionFeedback as Suggestion[]) ?? []),
    [suggestionFeedback],
  );
  const loveBrands = isSuggestionTab
    ? suggestionBrands
    : (emotionSummary?.brands ?? []);
  const loveBrandsTitle = getLoveBrandsTitle(activeTab);

  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log("UserProfilePage mounted:", mountCount.current);
  }, []);
  console.log("emotionSummary:", emotionSummary);
  console.log("loading:", loadingEmotionSummary);

  return (
    <div className={`user-profile-page ${isMobile ? "is-mobile" : ""}`}>
      <UserProfileBanner activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 👇 NOUVEAU WRAPPER */}
      <div className={`profile-main-wrapper banner-${activeTab}`}>
        <main className="user-main-content">
          <div className="feedback-list-wrapper">
            <div className="profile-section-header">
              <h2>{title}</h2>
              {subtitle && <span>{subtitle}</span>}
            </div>

            {activeTab === "report" ? (
              <UserGroupedReportsList />
            ) : (
              <UserFeedbackView activeTab={activeTab} />
            )}
          </div>
        </main>

        <aside className="right-panel">
          {isSuggestionTab && (
            // <UserVotesCard />
            <div className="suggestion-img-side-container">
              <img
                className="suggestion-img-side-img"
                src={Abracadabra}
                alt="image abracadabra"
              />
            </div>
          )}

          {/* 🔵 Bloc émotions (inchangé) */}
          <UserEmotionSummaryPanel
            data={emotionSummary}
            loading={loadingEmotionSummary}
          />

          {/* 🔽 SECTION SÉPARÉE */}
          <div className="love-brands-section">
            <UserLoveBrandsPanel brands={loveBrands} title={loveBrandsTitle} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfilePage;
