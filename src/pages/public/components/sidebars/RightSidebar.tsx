import { useMemo } from "react";
import "./RightSidebar.scss";
import type { PublicFeedFilterState } from "@src/components/feed/types/feedFilterTypes";
import RightSidebarDefaultCard from "./right-sidebar/RightSidebarDefaultCard";
import RightSidebarIllustrationCard from "./right-sidebar/RightSidebarIllustrationCard";
import { resolveRightSidebarIllustrationConfig } from "./right-sidebar/rightSidebarConfig";
import { useRightSidebarStats } from "./right-sidebar/useRightSidebarStats";

interface Props {
  filters?: PublicFeedFilterState;
}

const RightSidebar = ({ filters }: Props) => {
  const illustrationConfig = useMemo(() => {
    return resolveRightSidebarIllustrationConfig(filters);
  }, [filters]);
  const statsMode = illustrationConfig?.statsMode || "default";
  const { loading, stats } = useRightSidebarStats(statsMode);

  if (illustrationConfig) {
    return (
      <RightSidebarIllustrationCard
        config={illustrationConfig}
        loading={loading}
        stats={stats}
      />
    );
  }

  return <RightSidebarDefaultCard loading={loading} stats={stats} />;
};

export default RightSidebar;
