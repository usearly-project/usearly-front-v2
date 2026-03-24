import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "@src/types/feedItem";
import FeedItemRenderer from "./FeedItemRenderer";
import FeedFilter, { type FeedFilterType } from "./FeedFilter";
import ExpandableSearchBar from "../shared/search/ExpandableSearchBar";
import "./MixedFeed.scss";
import { useAuth } from "@src/services/AuthContext";

interface Props {
  feed: FeedItem[];
  totalFeedCount: number;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void | Promise<void>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  isPublic?: boolean;
}

const MixedFeed: React.FC<Props> = ({
  feed,
  totalFeedCount,
  loading,
  hasMore,
  loadMore,
  searchValue,
  onSearchChange,
  onSearchClear,
  isPublic = false,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };

  const handleFilter = (type: FeedFilterType) => {
    if (!isAuthenticated) {
      if (type === "report") {
        triggerTooltip("Connecte-toi pour voir les signalements");
      } else if (type === "coupdecoeur") {
        triggerTooltip("Connecte-toi pour voir les coups de cœur");
      } else if (type === "suggestion") {
        triggerTooltip("Connecte-toi pour voir les suggestions");
      } else {
        triggerTooltip("Connecte-toi pour continuer");
      }
      return;
    }

    navigate(`/feedback?tab=${type}`);
  };

  return (
    <div className="mixed-feed">
      {/* ✅ FILTER BAR */}
      <div className="feed-header">
        <FeedFilter onSelect={handleFilter} />
        <ExpandableSearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          className="feed-header__search"
          placeholder="Rechercher une publication"
          ariaLabel="Rechercher dans les publications affichées"
        />
      </div>

      {/* FEED */}
      {!loading &&
        totalFeedCount > 0 &&
        feed.length === 0 &&
        searchValue.trim() && (
          <div className="feed-empty-state">
            Aucune publication ne correspond à "{searchValue.trim()}".
          </div>
        )}

      {feed.map((item) => {
        const id =
          item.type === "report"
            ? item.data.reportingId
            : (item.data.id ?? item.data.title);

        return (
          <FeedItemRenderer
            key={`${item.type}-${id}`}
            item={item}
            isOpen={true}
            isPublic={isPublic}
          />
        );
      })}

      {/* LOADING */}
      {loading && <p className="feed-loading">Chargement...</p>}

      {/* LOAD MORE */}
      {!loading && hasMore && (
        <button onClick={loadMore} className="load-more-btn">
          Load more
        </button>
      )}

      {/* END */}
      {!loading && !hasMore && feed.length > 0 && (
        <p className="end-feed">Tu as tout vu 👀</p>
      )}

      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default MixedFeed;
