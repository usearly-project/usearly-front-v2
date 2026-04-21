import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UserFeedbackView.scss";
import InteractiveFeedbackCard from "@src/components/InteractiveFeedbackCard/InteractiveFeedbackCard";
import { useFetchUserFeedback } from "@src/hooks/useFetchUserFeedback";
import type { CoupDeCoeur, FeedbackType, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "../loader/SqueletonAnime";
import Champs, { type SelectFilterOption } from "../champs/Champs";
import { ArrowDownWideNarrow, CalendarArrowDown } from "lucide-react";

interface Props {
  activeTab: FeedbackType;
}

type FeedbackSortMode = "date" | "brand";

const FEEDBACK_SORT_OPTIONS: SelectFilterOption<FeedbackSortMode>[] = [
  { value: "date", label: "Date", IconComponent: CalendarArrowDown },
  { value: "brand", label: "Marque", IconComponent: ArrowDownWideNarrow },
];

/*
const normalizeBrand = (value?: string) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const buildBrandOptions = (
  data: Array<CoupDeCoeur | Suggestion>,
): SelectFilterOption[] => {
  const placeholder: SelectFilterOption = {
    value: "",
    label: "Marques",
  };

  if (!data.length) return [placeholder];

  const uniq = new Map<string, SelectFilterOption>();
  data.forEach((item) => {
    const brandLabel = item.marque?.trim();
    if (!brandLabel) return;

    const key = normalizeBrand(brandLabel);
    if (uniq.has(key)) return;

    uniq.set(key, {
      value: brandLabel,
      label: brandLabel,
      iconAlt: brandLabel,
      iconFallback: brandLabel,
      siteUrl: (item as any).siteUrl || (item as any).brandUrl,
    });
  });

  const sorted = Array.from(uniq.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "fr", { sensitivity: "base" }),
  );

  return [placeholder, ...sorted];
};
*/

const sortFeedbackItems = (
  items: Array<CoupDeCoeur | Suggestion>,
  sortMode: FeedbackSortMode,
) => {
  return [...items].sort((a, b) => {
    if (sortMode === "brand") {
      const brandComparison = (a.marque ?? "").localeCompare(
        b.marque ?? "",
        "fr",
        { sensitivity: "base" },
      );

      if (brandComparison !== 0) return brandComparison;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const renderFeedbackItems = ({
  activeTab,
  filteredData,
  sortedData,
  loading,
  loaderRef,
  openId,
}: {
  activeTab: FeedbackType;
  filteredData: Array<CoupDeCoeur | Suggestion>;
  sortedData: Array<CoupDeCoeur | Suggestion>;
  loading: boolean;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  openId: string | null;
}) => {
  if (loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  if (!filteredData.length) {
    return (
      <div className="user-feedback-empty">
        {/* Ancien message spécifique au filtre marque conservé si on le réactive plus tard. */}
        {/* {selectedBrand ? "Aucun contenu pour cette marque." : "Aucun contenu trouvé."} */}
        Aucun contenu trouvé.
      </div>
    );
  }

  if (activeTab === "coupdecoeur") {
    return (
      <>
        {(sortedData as CoupDeCoeur[]).map((item, index) => (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={{ ...item, type: "coupdecoeur" }}
            isOpen={openId === item.id}
            /* onToggle={(id) =>
              setOpenId((prev: string | null) => (prev === id ? null : id))
            } */
          />
        ))}
      </>
    );
  }

  if (activeTab === "suggestion") {
    return (
      <>
        {(sortedData as Suggestion[]).map((item, index) => (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={{ ...item, type: "suggestion" }}
            isOpen={openId === item.id}
            /* onToggle={(id) =>
              setOpenId((prev: string | null) => (prev === id ? null : id))
            } */
          />
        ))}
      </>
    );
  }

  return null;
};

const UserFeedbackView: React.FC<Props> = ({ activeTab }) => {
  const { data, loading } = useFetchUserFeedback(activeTab);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<FeedbackSortMode>("date");
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpenId(null);
    setSortMode("date");
  }, [activeTab]);

  /*
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const brandOptions = useMemo<SelectFilterOption[]>(
    () => buildBrandOptions(data),
    [data],
  );

  useEffect(() => {
    if (!selectedBrand) return;
    const exists = brandOptions.some((opt) => opt.value === selectedBrand);
    if (!exists) setSelectedBrand("");
  }, [brandOptions, selectedBrand]);

  const filteredData = useMemo(() => {
    if (!selectedBrand) return data;
    const target = normalizeBrand(selectedBrand);
    return data.filter((item) => normalizeBrand(item.marque) === target);
  }, [data, selectedBrand]);
  */

  const filteredData = useMemo(() => data, [data]);

  const sortedData = useMemo(() => {
    if (activeTab !== "coupdecoeur" && activeTab !== "suggestion") {
      return filteredData;
    }

    return sortFeedbackItems(filteredData, sortMode);
  }, [activeTab, filteredData, sortMode]);

  useEffect(() => {
    setOpenId(null);
  }, [sortMode]);

  return (
    <div className="user-feedback-view">
      {(activeTab === "coupdecoeur" || activeTab === "suggestion") && (
        <div className="feedback-filters">
          {/* Filtre marque masqué à la demande. */}
          {/* <Champs
            options={brandOptions}
            value={selectedBrand}
            onChange={setSelectedBrand}
            className="brand-select--feedback"
            brandSelect
            minWidth={225}
            minWidthPart="2"
            align="left"
            disabled={loading || brandOptions.length <= 1}
          /> */}

          <Champs
            options={FEEDBACK_SORT_OPTIONS}
            value={sortMode}
            onChange={setSortMode}
            className="feedback-sort-select"
            minWidth={150}
            minWidthPart="2"
            align="left"
            disabled={loading}
          />
        </div>
      )}

      {renderFeedbackItems({
        activeTab,
        filteredData,
        sortedData,
        loading,
        loaderRef,
        openId,
      })}
    </div>
  );
};

export default UserFeedbackView;
