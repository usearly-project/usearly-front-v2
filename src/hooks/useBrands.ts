import { useEffect, useState } from "react";
import { getAllBrands } from "@src/services/feedbackService";
import { getAllBrandsCdc } from "@src/services/coupDeCoeurService";
import { getAllBrandsSuggestion } from "@src/services/suggestionService";
import { normalizeDomain } from "@src/utils/brandLogos";

type BrandType = "report" | "coupdecoeur" | "suggestion";

export const useBrands = (
  type: BrandType = "report",
  options: { enabled?: boolean } = {},
) => {
  const enabled = options.enabled ?? true;
  const [brands, setBrands] = useState<{ marque: string; siteUrl?: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(enabled);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setBrands([]);
      setLoading(false);
      setHasLoaded(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      setHasLoaded(false);
      try {
        // 🔄 Sélection dynamique du service selon le type
        let data: any[] = [];
        if (type === "report") data = await getAllBrands();
        else if (type === "coupdecoeur") data = await getAllBrandsCdc();
        else if (type === "suggestion") data = await getAllBrandsSuggestion();

        // 🧩 Normalisation cohérente avec Reports / useBrandLogos
        const normalized = data.map((b: any) => {
          const marque = b.marque || b.name || b.brand || "";
          const rawUrl = b.siteUrl || b.domain || b.url || "";
          const cleanDomain =
            normalizeDomain(rawUrl) || `${marque.toLowerCase()}.com`;

          return {
            marque: marque.trim(),
            rawUrl: rawUrl || "(vide)",
            siteUrl: cleanDomain,
          };
        });

        // 🧠 Console visuelle : avant / après normalisation
        console.groupCollapsed(
          `📦 useBrands(${type}) → normalisation des domaines`,
        );
        console.table(
          normalized.map((b) => ({
            Marque: b.marque,
            "Avant (back)": b.rawUrl,
            "Après (normalisé)": b.siteUrl,
          })),
        );
        console.groupEnd();

        setBrands(
          normalized.map(({ marque, siteUrl }) => ({ marque, siteUrl })),
        );
      } catch (err) {
        console.error(`❌ Erreur récupération marques (${type}):`, err);
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    };

    fetch();
  }, [type, enabled]);

  return { brands, loading: enabled && (loading || !hasLoaded) };
};
