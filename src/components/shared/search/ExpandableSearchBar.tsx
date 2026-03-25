import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";
import "./ExpandableSearchBar.scss";

type ExpandableSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
  ariaLabel?: string;
  openButtonLabel?: string;
  closeButtonLabel?: string;
  clearButtonLabel?: string;
  disabled?: boolean;
  name?: string;
};

function ExpandableSearchBar({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Rechercher...",
  className = "",
  autoFocus = true,
  isOpen: controlledOpen,
  defaultOpen = false,
  onToggleOpen,
  ariaLabel = "Rechercher",
  openButtonLabel = "Ouvrir la recherche",
  closeButtonLabel = "Fermer la recherche",
  clearButtonLabel = "Effacer la recherche",
  disabled = false,
  name,
}: ExpandableSearchBarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen || Boolean(value),
  );
  const inputId = useId();
  const containerRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isOpen =
    typeof controlledOpen === "boolean" ? controlledOpen : uncontrolledOpen;
  const hasValue = value.trim().length > 0;

  const setOpen = (nextOpen: boolean) => {
    if (disabled) return;

    if (typeof controlledOpen !== "boolean") {
      setUncontrolledOpen(nextOpen);
    }

    onToggleOpen?.(nextOpen);
  };

  useEffect(() => {
    if (typeof controlledOpen === "boolean") {
      return;
    }

    if (value && !uncontrolledOpen) {
      setUncontrolledOpen(true);
    }
  }, [controlledOpen, uncontrolledOpen, value]);

  useEffect(() => {
    if (!isOpen || !autoFocus || disabled) {
      return;
    }

    const focusFrame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(focusFrame);
  }, [autoFocus, disabled, isOpen]);

  const clearValue = () => {
    if (disabled) return;

    if (onClear) {
      onClear();
    } else {
      onChange("");
    }

    inputRef.current?.focus();
  };

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen) {
      setOpen(true);
      return;
    }

    if (!hasValue) {
      setOpen(false);
      return;
    }

    inputRef.current?.focus();
  };

  const handleBlurCapture = () => {
    requestAnimationFrame(() => {
      const activeElement = document.activeElement;

      if (containerRef.current?.contains(activeElement)) {
        return;
      }

      if (!hasValue) {
        setOpen(false);
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  const handleEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();

    if (hasValue) {
      clearValue();
      return;
    }

    inputRef.current?.blur();
    setOpen(false);
  };

  const classes = [
    "expandable-search-bar",
    isOpen && "is-open",
    disabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const toggleLabel = isOpen
    ? hasValue
      ? ariaLabel
      : closeButtonLabel
    : openButtonLabel;

  return (
    <form
      ref={containerRef}
      className={classes}
      role="search"
      onSubmit={handleSubmit}
      onBlurCapture={handleBlurCapture}
    >
      <div className="expandable-search-bar__body" aria-hidden={!isOpen}>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          name={name}
          value={value}
          disabled={disabled}
          tabIndex={isOpen ? 0 : -1}
          className="expandable-search-bar__input"
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleEscape}
        />

        {hasValue && (
          <button
            type="button"
            className="expandable-search-bar__clear"
            aria-label={clearButtonLabel}
            onClick={clearValue}
            disabled={disabled}
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <button
        type="button"
        className="expandable-search-bar__toggle"
        aria-expanded={isOpen}
        aria-controls={inputId}
        aria-label={toggleLabel}
        onClick={handleToggle}
        disabled={disabled}
      >
        <Search size={18} aria-hidden />
      </button>
    </form>
  );
}

export default ExpandableSearchBar;
