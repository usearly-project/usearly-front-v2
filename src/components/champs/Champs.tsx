import { useMemo, useState, useRef, useEffect, useLayoutEffect } from "react";
import "./Champs.scss";
import Trigger from "./Trigger/Trigger";
import { SearchBar } from "./SearchBar/SearchBar";
import SelectOption from "./SelectOption/SelectOption";
import Select from "@src/components/selectInput/Select";
import type { LucideIcon } from "lucide-react";
import * as Utils from "./SelectFilter.utils";

export type SelectFilterOption<V extends string = string> = {
  value: V;
  label: string;
  emoji?: string;
  iconUrl?: string;
  iconFallback?: string;
  iconAlt?: string;
  siteUrl?: string;
  IconComponent?: LucideIcon;
};

type Props<V extends string = string> = {
  options: SelectFilterOption<V>[];
  value: V;
  onChange: (val: V) => void;
  activeOnValue?: V;
  activeClassName?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "grid";
  brandSelect?: boolean;
  iconVisible?: boolean;
  minWidth?: number;
  minWidthPart?: "1" | "2" | "both";
  fitWidthToOptions?: boolean;
  align?: "left" | "center" | "right";
  placeholderResetLabel?: string;
  loading?: boolean;
  fixedBrandIconUrl?: string;
};

const normalize = (label?: string) => label?.toLowerCase().trim() ?? "";
const PLACEHOLDER_LABEL = normalize("Marques");

export default function SelectFilter<V extends string = string>(
  props: Props<V>,
) {
  const {
    options,
    value,
    onChange,
    activeOnValue,
    activeClassName,
    className = "",
    disabled = false,
    variant = "default",
    brandSelect,
    iconVisible = true,
    minWidth = 0,
    fitWidthToOptions = false,
    align = "center",
    minWidthPart = "both",
    placeholderResetLabel,
    loading = false,
  } = props;
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [autoMinWidth, setAutoMinWidth] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionsContainerRef = useRef<HTMLDivElement | null>(null);
  const measurementRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () =>
      options.find(
        (o) =>
          o.value?.toString().toLowerCase().trim() ===
          value?.toString().toLowerCase().trim(),
      ),
    [options, value],
  );
  const placeholderOption = useMemo(
    () => options.find((opt) => !opt.value),
    [options],
  );

  const isBrandSelect = useMemo(() => {
    if (typeof brandSelect === "boolean") return brandSelect;
    if (!placeholderOption) return false;
    return (
      !placeholderOption.value &&
      normalize(placeholderOption.label) === PLACEHOLDER_LABEL
    );
  }, [brandSelect, placeholderOption]);

  const shouldHideForLoading = Boolean(loading) && !(isBrandSelect && value);
  const filteredOptions = useMemo(() => {
    const query = normalize(searchValue);
    const display =
      isBrandSelect || placeholderResetLabel
        ? options.filter((opt) => `${opt.value ?? ""}`.length > 0)
        : options;
    return !isBrandSelect || !query
      ? display
      : display.filter(
          (opt) =>
            normalize(opt.label).includes(query) ||
            normalize(`${opt.value ?? ""}`).includes(query),
        );
  }, [options, isBrandSelect, searchValue, placeholderResetLabel]);

  const selectedVisual = useMemo(() => {
    if (!iconVisible) return null;
    if (isBrandSelect) return null;
    return Utils.renderLeadingVisual(selected);
  }, [iconVisible, isBrandSelect, selected]);

  const shouldMeasureOptionsWidth = isBrandSelect || fitWidthToOptions;

  useLayoutEffect(() => {
    if (shouldHideForLoading || !shouldMeasureOptionsWidth) {
      setAutoMinWidth(null);
      return;
    }
    const measure = () => {
      if (!measurementRef.current) return;
      const items = Array.from(
        measurementRef.current.querySelectorAll<HTMLElement>(
          ".select-filter-measure-item",
        ),
      );
      const maxWidth = items.reduce(
        (max, el) => Math.max(max, el.getBoundingClientRect().width),
        0,
      );
      if (maxWidth) setAutoMinWidth(Math.ceil(maxWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [shouldMeasureOptionsWidth, shouldHideForLoading, options, iconVisible]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  useEffect(() => {
    if (open && isBrandSelect)
      requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [open, isBrandSelect]);

  const toggleOpen = () => {
    if (disabled || shouldHideForLoading) return;
    setOpen(!open);
    if (!open) {
      requestAnimationFrame(() => {
        const h = wrapperRef.current?.getBoundingClientRect().height ?? 0;
        setOffset(h ? h + 5 : 50);
        setTimeout(() => setOffset(null), 200);
      });
    }
  };

  const cssMinW =
    Math.max(
      minWidth,
      shouldMeasureOptionsWidth && autoMinWidth ? autoMinWidth : 0,
    ) + "px";
  const shouldApplyWrapperWidth = fitWidthToOptions && Boolean(autoMinWidth);

  return (
    <div
      ref={wrapperRef}
      className={`${variant === "grid" ? "select-filter-wrapper--grid" : "select-filter-wrapper"} ${open || (activeOnValue !== undefined && value === activeOnValue) ? activeClassName : ""} ${shouldHideForLoading ? "is-loading" : ""} ${className}`}
      onClick={toggleOpen}
      style={{
        textAlign: align as any,
        minWidth:
          minWidthPart !== "2" || fitWidthToOptions ? cssMinW : undefined,
        width: shouldApplyWrapperWidth ? cssMinW : undefined,
        maxWidth: fitWidthToOptions ? "100%" : undefined,
        display: shouldHideForLoading ? "none" : "block",
      }}
    >
      <div
        className={`popup-hot-filter ${open ? "is-open" : ""}`}
        style={{
          marginTop: offset ? `${offset}px` : "45px",
          minWidth: minWidthPart !== "1" ? cssMinW : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-hot-filter-container" ref={optionsContainerRef}>
          {isBrandSelect && (
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onClear={() => {
                setSearchValue("");
                searchInputRef.current?.focus();
              }}
              inputRef={searchInputRef}
            />
          )}
          {filteredOptions.map((opt) => (
            <SelectOption
              key={opt.value}
              value={opt.value}
              label={Utils.getDisplayLabel(opt.label, isBrandSelect)}
              leading={
                !iconVisible
                  ? null
                  : isBrandSelect
                    ? Utils.renderBrandAvatar(
                        opt,
                        Utils.BRAND_AVATAR_SIZE_OPTION,
                        !opt.value ? "brand-logo--placeholder" : "",
                        !!opt.value,
                      )
                    : Utils.renderLeadingVisual(opt)
              }
              selected={opt.value === value}
              onSelect={(v) => {
                onChange(v);
                setOpen(false);
              }}
            />
          ))}
        </div>
        {placeholderOption &&
          value &&
          (placeholderResetLabel || isBrandSelect) && (
            <div
              className={
                variant === "grid"
                  ? "popup-hot-filter-footer grid"
                  : "popup-hot-filter-footer"
              }
            >
              <button
                type="button"
                className="select-filter-reset"
                onClick={() => {
                  onChange(placeholderOption.value as V);
                  setOpen(false);
                }}
                aria-label={placeholderResetLabel ?? "Réinitialiser"}
              >
                {placeholderResetLabel ?? "Réinitialiser"}
              </button>
            </div>
          )}
      </div>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled || shouldHideForLoading}
        className="select-filter"
      />
      <Trigger
        leading={selectedVisual}
        label={
          Utils.getDisplayLabel(selected?.label, isBrandSelect) || "Marques"
        }
      />
      {shouldMeasureOptionsWidth && (
        <div
          className="select-filter-measurements"
          ref={measurementRef}
          aria-hidden
        >
          {options.map((opt, i) => (
            <Trigger
              key={i}
              leading={
                fitWidthToOptions && iconVisible && !isBrandSelect
                  ? Utils.renderLeadingVisual(opt)
                  : null
              }
              label={Utils.getDisplayLabel(opt.label, isBrandSelect)}
              className="select-filter-measure-item"
            />
          ))}
        </div>
      )}
    </div>
  );
}
