import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";
import { getMostAdvancedStatus } from "@src/utils/ticketStatus";
import type { TicketStatusKey } from "@src/types/ticketStatus";
import { groupBrandReportsAsTickets } from "../utils/brandReportStats";
/* import { useBrandResponsesMap } from "@src/hooks/useBrandResponsesMap";
import { normalizeBrandResponse } from "@src/utils/brandResponse"; */

interface BrandFilteredSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  loadingFiltered: boolean;
  reportsToDisplay: any[];
  showSelectedBrandSummary?: boolean;

  // ⚠️ conservée volontairement (utilisée ailleurs / contrat parent)
  getBrandLogo: (brand: string, siteUrl?: string) => string;

  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🔑 Regroupement FRONT — Option A
 * 1 ticket logique par subCategory (aligné front marque)
 */
function groupReportsAsTickets(reports: any[]) {
  const ticketGroups = groupBrandReportsAsTickets(reports);

  return ticketGroups.map((ticket) => ({
    ...ticket,
    status: reports
      .filter(
        (report) => (report.subCategory || "Autre") === ticket.subCategory,
      )
      .reduce(
        (currentStatus, report) =>
          getMostAdvancedStatus(
            currentStatus,
            (report.status ?? currentStatus) as TicketStatusKey,
          ),
        ticket.status,
      ),
  }));
}

/**
 * 🏷️ Section BrandFiltered
 * Vue TICKET (alignée avec le front marque)
 */
const BrandFilteredSection: React.FC<BrandFilteredSectionProps> = ({
  selectedBrand,
  selectedCategory,
  // selectedSiteUrl,
  filteredByCategory,
  loadingFiltered,
  reportsToDisplay,
  showSelectedBrandSummary = true,
  loaderRef,
}) => {
  /*   const allReportIds = reportsToDisplay.map((r) => r.reportingId);
  const { brandResponsesMap } = useBrandResponsesMap(allReportIds); */

  // 🕓 Chargement
  if (loadingFiltered) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  // ⚠️ Aucun résultat
  if (!reportsToDisplay.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement trouvé pour ces filtres...
      </div>
    );
  }

  // ✅ REGROUPEMENT OPTION A
  const ticketGroups = groupReportsAsTickets(reportsToDisplay);

  return (
    <div className="grouped-by-category">
      {selectedBrand && showSelectedBrandSummary && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            {/* <div className="selected-brand-summary__logo">
              <Avatar
                avatar={null}
                pseudo={selectedBrand}
                type="brand"
                siteUrl={selectedSiteUrl}
                preferBrandLogo={true}
              />
            </div> */}

            <div className="selected-brand-summary__info-container">
              {selectedCategory ? (
                <>
                  <span className="count">{filteredByCategory.length}</span>
                  <span className="text">
                    Signalement
                    {filteredByCategory.length > 1 ? "s" : ""} lié
                    {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                    <b>{selectedCategory}</b> » sur{" "}
                    {capitalizeFirstLetter(selectedBrand)}
                  </span>
                </>
              ) : (
                <>
                  <span className="count">{ticketGroups.length}</span>
                  <span className="text">
                    Problème{ticketGroups.length > 1 ? "s" : ""} sur{" "}
                    {capitalizeFirstLetter(selectedBrand)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ 1 CARTE = 1 TICKET LOGIQUE */}
      {ticketGroups.map((ticket) => {
        const rawBrandResponse = reportsToDisplay.find((r) =>
          ticket.reportIds.includes(r.reportingId),
        )?.hasBrandResponse;

        const hasBrandResponse =
          rawBrandResponse &&
          typeof rawBrandResponse === "object" &&
          ("message" in rawBrandResponse ||
            "content" in rawBrandResponse ||
            "response" in rawBrandResponse)
            ? rawBrandResponse
            : undefined;
        console.log("BRAND FILTERED 👉", hasBrandResponse);
        return (
          <FlatSubcategoryBlock
            key={ticket.pivotReportId}
            reportIds={ticket.reportIds}
            brand={ticket.brand}
            siteUrl={ticket.siteUrl ?? undefined}
            subcategory={ticket.subCategory}
            descriptions={ticket.descriptions}
            capture={ticket.capture}
            status={ticket.status}
            hideFooter={true}
            hasBrandResponse={hasBrandResponse} // ✅ clean
            solutionsCount={ticket.solutionsCount}
          />
        );
      })}
    </div>
  );
};

export default BrandFilteredSection;
