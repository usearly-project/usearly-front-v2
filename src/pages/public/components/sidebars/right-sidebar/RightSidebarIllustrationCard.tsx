import FilterIllustrationNextToText from "@src/pages/home/home-illustration/FilterIllustrationNextToText";
import type {
  RightSidebarIllustrationConfig,
  RightSidebarStatItem,
} from "./rightSidebarTypes";
import RightSidebarStats from "./RightSidebarStats";

interface Props {
  config: RightSidebarIllustrationConfig;
  loading: boolean;
  stats: RightSidebarStatItem[];
}

const RightSidebarIllustrationCard = ({ config, loading, stats }: Props) => {
  console.log(stats);
  const hasStats = stats.length > 0;

  return (
    <div
      className={`right-sidebar right-sidebar--illustration ${config.themeClass}`.trim()}
    >
      <FilterIllustrationNextToText
        filter={config.filter}
        onglet={config.onglet}
        withText
      />

      {config.text ? (
        <p
          className="right-sidebar-illustration-text"
          style={!loading && !hasStats ? { marginBottom: 0 } : undefined}
        >
          {config.text}
        </p>
      ) : null}

      {loading ? <p>Chargement...</p> : <RightSidebarStats items={stats} />}
    </div>
  );
};

export default RightSidebarIllustrationCard;
