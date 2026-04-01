import type { FeedbackType } from "@src/types/Reports";
import "./FeedbackTabs.scss";

const tabs: { key: FeedbackType; label: string }[] = [
  { key: "report", label: "Signalements" },
  { key: "coupdecoeur", label: "Coups de cœur" },
  { key: "suggestion", label: "Suggestions" },
];

interface FeedbackTabsProps {
  activeTab: FeedbackType;
  onTabChange: (type: FeedbackType) => void;
}

const FeedbackTabs = ({ activeTab, onTabChange }: FeedbackTabsProps) => {
  return (
    <div className="feedback-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onTabChange(tab.key)} // ✅ Plus d'erreur ici
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FeedbackTabs;
