import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import "./BrandSelect.scss";

interface BrandSelectProps {
  brands?: (string | { brand: string; siteUrl?: string })[];
  selectedBrand: string;
  onSelect: (brand: string, siteUrl?: string) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  siteUrl?: string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const isAllValue = (v?: string) => {
  const n = normalize(v || "");
  return n === "tous" || n === "tout" || n === "all";
};

export const BrandSelect = ({
  brands = [],
  selectedBrand = "",
  onSelect,
  onClear,
  placeholder = "Marques",
  searchPlaceholder = "Rechercher une marque…",
  className = "",
}: BrandSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const safeBrands = Array.isArray(brands) ? brands : [];

  // 🧩 Uniformise vers { brand, siteUrl }
  const brandEntries = useMemo(() => {
    return safeBrands.map((b) =>
      typeof b === "object" && "brand" in b
        ? { brand: b.brand, siteUrl: b.siteUrl }
        : { brand: b, siteUrl: undefined },
    );
  }, [safeBrands]);

  // ✅ Logos dynamiques Clearbit
  const brandLogos = useBrandLogos(brandEntries);

  const toCanonicalBrand = (name?: string) => {
    if (!name) return undefined;
    const n = normalize(name);
    const match = safeBrands.find((b) => {
      const brandName = typeof b === "string" ? b : b.brand;
      return normalize(brandName) === n;
    });
    return typeof match === "string" ? match : match?.brand;
  };

  const filteredEntries = useMemo(() => {
    const list = brandEntries.filter(
      (b) => !query.trim() || normalize(b.brand).includes(normalize(query)),
    );
    const uniqueMap = new Map<string, { brand: string; siteUrl?: string }>();
    list.forEach((b) => {
      if (!uniqueMap.has(normalize(b.brand))) {
        uniqueMap.set(normalize(b.brand), b);
      }
    });
    return Array.from(uniqueMap.values());
  }, [brandEntries, query]);

  // 👇 ferme le dropdown au clic extérieur
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isSuspiciousImage = (url: string) => {
    // 🧠 Cas où Clearbit retourne une photo ou une image générique
    return (
      url.includes("clearbit.com") &&
      (url.includes("fr/") || url.includes("de/") || url.includes("es/"))
    );
  };

  const renderBadge = (brand?: string) => {
    if (isAllValue(brand)) return null;
    const canonical = toCanonicalBrand(brand);
    if (!canonical) return <span className="brand-badge__initial">?</span>;

    const brandKey = canonical.toLowerCase().trim();
    let logo = brandLogos[brandKey];

    // ✅ Corrige les domaines régionaux (amazon.fr → amazon.com)
    if (logo && isSuspiciousImage(logo)) {
      const fixed = `https://logo.clearbit.com/${brandKey}.com`;
      console.warn(
        `⚠️ Logo suspect détecté (${brandKey}), fallback vers .com :`,
        fixed,
      );
      logo = fixed;
    }

    // 🧩 Fallback ultime → initiales
    const showInitial = !logo || logo === FALLBACK_BRAND_PLACEHOLDER;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.style.display = "none";
      const initials = img.nextElementSibling as HTMLElement | null;
      if (initials) initials.style.display = "inline";
      console.warn(`⚠️ Logo échoué pour ${canonical}:`, logo);
    };

    return (
      <span className="brand-badge__wrapper">
        {logo && !showInitial && (
          <img
            src={logo}
            alt={canonical}
            className="brand-badge__logo"
            onError={handleError}
            loading="lazy"
          />
        )}
        <span
          className="brand-badge__initial"
          style={{ display: showInitial ? "inline" : "none" }}
        >
          {canonical.slice(0, 2).toUpperCase()}
        </span>
      </span>
    );
  };

  const rootClassName = ["brand-select", className].filter(Boolean).join(" ");
  const triggerClassName = [
    "brand-select__trigger",
    selectedBrand ? "brand-select__trigger--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} ref={containerRef}>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={
          selectedBrand ? "Marque sélectionnée : " + selectedBrand : placeholder
        }
      >
        {!isAllValue(selectedBrand) && (
          <span className="brand-badge">{renderBadge(selectedBrand)}</span>
        )}
        <span className="brand-select__label">
          {selectedBrand || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="brand-select__content">
          <div className="brand-select__search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
            {query && (
              <button
                type="button"
                className="brand-select__search-clear"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche de marque"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <ul className="brand-select__list">
            {filteredEntries.length === 0 && (
              <li className="brand-select__empty">Aucune marque trouvée</li>
            )}
            {filteredEntries.map((entry) => {
              const brand = entry.brand;
              const optionClassName = [
                "brand-select__option",
                brand === selectedBrand ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <li key={brand}>
                  <button
                    type="button"
                    className={optionClassName}
                    onClick={() => {
                      onSelect(entry.brand, entry.siteUrl);
                      setQuery("");
                      setOpen(false);
                    }}
                    aria-label={"Sélectionner " + brand}
                  >
                    <span className="brand-badge">{renderBadge(brand)}</span>
                    <span className="brand-select__option-label">{brand}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selectedBrand && (
            <button
              type="button"
              className="brand-select__clear"
              onClick={() => {
                onClear?.();
                setQuery("");
                setOpen(false);
              }}
              aria-label="Retirer la marque"
            >
              <X size={14} />
              Retirer la marque
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandSelect;
