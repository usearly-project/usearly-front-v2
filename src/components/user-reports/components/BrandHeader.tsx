import { ChevronDown } from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "@src/components/shared/Avatar";
import { compactRelativeDateLabel } from "@src/utils/dateUtils";

interface Props {
  reportsLength: number;
  brand: string;
  siteUrl: string;
  mostRecentDate: Date | null;
  onToggle: () => void;
}

const BrandHeader: React.FC<Props> = ({
  reportsLength,
  brand,
  siteUrl,
  mostRecentDate,
  onToggle,
}) => {
  return (
    <div className="brand-header" onClick={onToggle}>
      <p className="brand-reports-count">
        <strong>{reportsLength}</strong> signalement
        {reportsLength > 1 ? "s" : ""} sur <strong>{brand}</strong>
      </p>

      <p className="date-card">
        {mostRecentDate
          ? `Il y a ${compactRelativeDateLabel(
              formatDistance(mostRecentDate, new Date(), {
                locale: fr,
                includeSeconds: true,
              }),
            )}`
          : "Date inconnue"}
      </p>

      <Avatar
        avatar={null}
        pseudo={brand}
        type="brand"
        siteUrl={siteUrl}
        wrapperClassName="avatar brand-logo"
      />

      <ChevronDown size={18} className="chevron-icon" />
    </div>
  );
};

export default BrandHeader;
