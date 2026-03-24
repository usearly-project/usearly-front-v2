import { useState } from "react";
import MixedFeed from "@src/components/feed/MixedFeed";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import { filterFeedItems } from "@src/utils/feedSearch";
import "./PublicFeed.scss";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftSidebar from "./components/sidebars/LeftSidebar";
import RightSidebar from "./components/sidebars/RightSidebar";

function PublicFeed() {
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [searchValue, setSearchValue] = useState("");
  const filteredFeed = filterFeedItems(feed, searchValue);

  return (
    <div className="public-feed-page">
      {/* HEADER */}
      <HeroBanner />

      {/* GRID */}
      <div className="public-feed-layout">
        <aside className="public-feed-left">
          <LeftSidebar />
        </aside>

        <main className="public-feed-center">
          <MixedFeed
            feed={filteredFeed}
            totalFeedCount={feed.length}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchClear={() => setSearchValue("")}
            isPublic
          />
        </main>

        <aside className="public-feed-right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default PublicFeed;
