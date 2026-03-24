import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./FeedFilter.scss";

export type FeedFilterType = "report" | "coupdecoeur" | "suggestion";

type FeedFilterOption = {
  value: FeedFilterType;
  label: string;
};

type FeedFilterProps = {
  label?: string;
  options?: FeedFilterOption[];
  onSelect: (value: FeedFilterType) => void;
};

const defaultOptions: FeedFilterOption[] = [
  { value: "report", label: "Les signalements" },
  { value: "coupdecoeur", label: "Les coups de cœur" },
  { value: "suggestion", label: "Les suggestions" },
];

const FeedFilter: React.FC<FeedFilterProps> = ({
  label = "L’actu du moment",
  options = defaultOptions,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: FeedFilterType) => {
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <div className="feed-filter">
      <button
        type="button"
        className="feed-filter__trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {label}
        <ChevronDown size={16} className="select-filter-chevron" />
      </button>

      {isOpen && (
        <div className="filter-dropdown" role="menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="filter-dropdown__item"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedFilter;
