import Avatar from "@src/components/shared/Avatar";
import { getBrandLogo } from "@src/utils/brandLogos";
import "./BrandProgressRow.scss";

type Props = {
  name: string;
  siteUrl: string;
  progress: number;
  label: string;
  count: number;
  isTop?: boolean;
  onHover: (e: React.MouseEvent, text: string) => void;
  onLeave: () => void;
};

const BrandProgressRow = ({
  name,
  siteUrl,
  count,
  label,
  isTop,
  onHover,
  onLeave,
}: Props) => {
  const MAX = 30;

  const safeCount = Math.min(count, MAX);
  const computedProgress = (safeCount / MAX) * 100;
  return (
    <div className={`brand-row ${isTop ? "top" : ""}`}>
      <div className="brand-row-top">
        <Avatar
          avatar={getBrandLogo(name, siteUrl)}
          pseudo={name}
          type="brand"
          sizeHW={32}
        />

        <div className="brand-info">
          <span className="brand-label">{label}</span>
          <div className="brand-progress">
            <div className="progress-bar">
              <div
                className={`progress-bar-fill ${count > MAX ? "over-limit" : ""}`}
                style={{ width: `${computedProgress}%` }}
              />
            </div>
          </div>
        </div>

        <span
          className="progress-score"
          onMouseEnter={(e) => onHover(e, `${name} — ${count} signalements`)}
          onMouseLeave={onLeave}
        >
          <span className="progress-score-count">{count}</span>/{MAX}
        </span>
      </div>
    </div>
  );
};

export default BrandProgressRow;
