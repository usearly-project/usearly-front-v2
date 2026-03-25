import { useState } from "react";
import MixedFeed from "@src/components/feed/MixedFeed";
import type { PublicFeedFilterState } from "@src/components/feed/feedFilterTypes";
import { useIsMobile } from "@src/hooks/use-mobile";
import "./PublicFeed.scss";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftSidebar from "./components/sidebars/LeftSidebar";
import RightSidebar from "./components/sidebars/RightSidebar";

function PublicFeed() {
  const isTablet = useIsMobile("(max-width: 1400px)");
  const isMobile = useIsMobile("(max-width: 1090px)");
  const [publicFeedFilters, setPublicFeedFilters] =
    useState<PublicFeedFilterState>({
      selectedFilter: "all",
      reportFeedFilter: "chrono",
      cdcFeedFilter: "chrono",
      suggestionFeedFilter: "allSuggest",
    });

  return (
    <div className="public-feed-page">
      {/* HEADER */}
      <HeroBanner />

      {/* GRID */}
      <div className={`public-feed-layout`}>
        <aside className="public-feed-left">
          {isTablet ? (
            <>
              {isMobile ? null : (
                <div className="public-feed-left-tablet">
                  <RightSidebar filters={publicFeedFilters} />
                  <LeftSidebar />
                </div>
              )}
            </>
          ) : (
            <LeftSidebar />
          )}
        </aside>

        <main className="public-feed-center">
          <MixedFeed isPublic onPublicFiltersChange={setPublicFeedFilters} />
        </main>

        {!isTablet && (
          <aside className="public-feed-right">
            <RightSidebar filters={publicFeedFilters} />
          </aside>
        )}
      </div>
    </div>
  );
}

export default PublicFeed;
