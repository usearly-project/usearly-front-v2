import { useState } from "react";
import MixedFeed from "@src/components/feed/MixedFeed";
import type { PublicFeedFilterState } from "@src/components/feed/types/feedFilterTypes";
import { useIsMobile } from "@src/hooks/use-mobile";
import "./PublicFeed.scss";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftSidebar from "./components/sidebars/LeftSidebar";
import RightSidebar from "./components/sidebars/RightSidebar";
// import AppDownloadCTA from "@src/components/app-download/AppDownloadCTA";

function PublicFeed() {
  // const isCompactDesktop = useIsMobile("(max-width: 1350px)");
  const isMobileLayout = useIsMobile("(max-width: 1220px)");
  const arePanelsHidden = useIsMobile("(max-width: 992px)");
  const [publicFeedFilters, setPublicFeedFilters] =
    useState<PublicFeedFilterState>({
      selectedFilter: "all",
      reportFeedFilter: "chrono",
      cdcFeedFilter: "chrono",
      suggestionFeedFilter: "allSuggest",
    });

  return (
    <div className="public-feed-page">
      <HeroBanner isMobile={isMobileLayout} />

      <div className={`public-feed-layout`}>
        {!arePanelsHidden && (
          <div className="public-feed-panels">
            <aside className="public-feed-left">
              <LeftSidebar />
            </aside>
            <aside className="public-feed-right">
              <RightSidebar filters={publicFeedFilters} />
            </aside>
          </div>
        )}

        <main className="public-feed-center">
          {/* AJOUT DE LA PROP isMobile ICI */}
          <MixedFeed
            isPublic
            onPublicFiltersChange={setPublicFeedFilters}
            isMobile={isMobileLayout}
            showMobileHeaderText={arePanelsHidden}
          />
          {/* <AppDownloadCTA className="public-feed-app-download-cta" /> */}
        </main>
      </div>
    </div>
  );
}

export default PublicFeed;
