import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import ReportListView from "../ReportListView";

const ConfirmedReportsList = ({
  expandedItems,
  handleToggle,
  searchTerm,
  onClearSearchTerm,
}: {
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  searchTerm?: string;
  onClearSearchTerm?: () => void;
}) => {
  const { data } = useConfirmedFlatData();

  const explodedData: ExplodedGroupedReport[] = data.flatMap((group) =>
    group.subCategories.map((subCategory) => ({
      ...group, // 🔥 TRÈS IMPORTANT (garde tout intact)
      subCategory,
      subCategories: [subCategory],
    })),
  );
  return (
    <ReportListView
      filter=""
      viewMode="confirmed"
      flatData={explodedData}
      expandedItems={expandedItems}
      handleToggle={handleToggle}
      chronoData={{}}
      popularData={{}}
      popularEngagementData={{}}
      rageData={{}}
      loadingChrono={false}
      loadingPopular={false}
      loadingPopularEngagement={false}
      loadingRage={false}
      searchTerm={searchTerm}
      onClearSearchTerm={onClearSearchTerm}
    />
  );
};

export default ConfirmedReportsList;
