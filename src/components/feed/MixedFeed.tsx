import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedItemRenderer from "./FeedItemRenderer";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import ExpandableSearchBar from "@src/components/shared/search/ExpandableSearchBar";
import { filterFeedItems } from "@src/utils/feedSearch";
import "./MixedFeed.scss";
import { useAuth } from "@src/services/AuthContext";
import chevronDown from "/assets/dashboardUser/chevron-down-svgrepo-com.svg";

interface Props {
  isPublic?: boolean;
}

const MixedFeed: React.FC<Props> = ({ isPublic = false }) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const filteredFeed = filterFeedItems(feed, searchValue);
  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };

  const handleFilter = (type: string) => {
    setIsOpen(false);

    if (type === "trending") return;

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
        <div className="feed-filter">
          <button onClick={() => setIsOpen(!isOpen)}>
            L’actu du moment{" "}
            <img src={chevronDown} width={16} height={16} alt="chevron" />
          </button>

          {isOpen && (
            <div className="filter-dropdown">
              <div onClick={() => handleFilter("report")}>Les signalements</div>

              <div onClick={() => handleFilter("coupdecoeur")}>
                Les coups de cœur
              </div>

              <div onClick={() => handleFilter("suggestion")}>
                Les suggestions
              </div>
            </div>
          )}
        </div>

        <ExpandableSearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          className="feed-header__search"
          placeholder="Rechercher une publication"
          ariaLabel="Rechercher dans les publications affichées"
        />
      </div>

      {/* FEED */}
      {!loading &&
        feed.length > 0 &&
        filteredFeed.length === 0 &&
        searchValue.trim() && (
          <div className="feed-empty-state">
            Aucune publication ne correspond à "{searchValue.trim()}".
          </div>
        )}

      {filteredFeed.map((item) => {
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
