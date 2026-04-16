import { pluralize } from "@src/utils/plurilize";
import type { RightSidebarStatItem } from "./rightSidebarTypes";
import arrowRight from "/assets/icons/arrow-right.svg";

interface Props {
  items: RightSidebarStatItem[];
}

const RightSidebarStats = ({ items }: Props) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="stats">
      {items.map((item, index) => (
        <div
          className="stat-item"
          key={`${item.singular}-${item.suffix ?? "stat"}-${index}`}
        >
          <span className="arrow">
            <img src={arrowRight} alt="arrow right" />
          </span>
          <span className="label">
            <span className="value">{item.value}</span>
            {pluralize(item.value, item.singular, item.plural)}
            {item.suffix ? ` ${item.suffix}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RightSidebarStats;
