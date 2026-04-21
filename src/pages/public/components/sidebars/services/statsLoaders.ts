import { getRightSidebarStats } from "@src/services/feedbackService";
import { loadAllReports, loadAllSuggestions } from "./publicFeedLoader";
import { getSafeNumber } from "../utils/statsUtils";

const HOT_THRESHOLD = 2;

export const loadDefaultStats = async () => {
  const [apiStats, reports] = await Promise.all([
    getRightSidebarStats().catch(() => null),
    loadAllReports(),
  ]);

  const growing = reports.filter(
    (r) =>
      getSafeNumber(r.reportsCount) + getSafeNumber(r.confirmationsCount) >=
      HOT_THRESHOLD,
  );

  return [
    {
      value: growing.length || apiStats?.totalTickets || 0,
      singular: "problème qui prend de l'ampleur",
      plural: "problèmes qui prennent de l'ampleur",
    },
  ];
};

export const loadSuggestionStats = async () => {
  const suggestions = await loadAllSuggestions();

  return [
    {
      value: suggestions.length,
      singular: "suggestion",
      plural: "suggestions",
    },
  ];
};
