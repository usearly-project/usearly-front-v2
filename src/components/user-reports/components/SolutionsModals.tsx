import SolutionModal from "@src/components/ui/SolutionModal";
import SolutionsModal from "@src/components/ui/SolutionsModal";

interface Props {
  activeReportId: string | null;
  showSolutionModal: boolean;
  showSolutionsList: boolean;
  setShowSolutionModal: (v: boolean) => void;
  setShowSolutionsList: (v: boolean) => void;
}

const SolutionsModals: React.FC<Props> = ({
  activeReportId,
  showSolutionModal,
  showSolutionsList,
  setShowSolutionModal,
  setShowSolutionsList,
}) => {
  return (
    <>
      {showSolutionModal && activeReportId && (
        <SolutionModal
          reportId={activeReportId}
          onClose={() => setShowSolutionModal(false)}
        />
      )}

      {showSolutionsList && activeReportId && (
        <SolutionsModal
          reportId={activeReportId}
          onClose={() => setShowSolutionsList(false)}
          onAddSolution={() => {
            setShowSolutionsList(false);
            setShowSolutionModal(true);
          }}
        />
      )}
    </>
  );
};

export default SolutionsModals;
