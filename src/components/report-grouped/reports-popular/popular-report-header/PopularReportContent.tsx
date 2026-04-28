import React from "react";

interface Props {
  descriptionText: string;
  showFullText: boolean;
  setShowFullText: React.Dispatch<React.SetStateAction<boolean>>;
  captureUrl: string | null;
  descriptionLength: number;
  previewLength: number;
  setShowCapturePreview: (v: boolean) => void;
  descriptionMarginLeft?: number;
}

const PopularReportContent: React.FC<Props> = ({
  descriptionText,
  showFullText,
  setShowFullText,
  captureUrl,
  descriptionLength,
  previewLength,
  setShowCapturePreview,
  descriptionMarginLeft,
}) => {
  const shouldShowToggle = descriptionLength > previewLength || !!captureUrl;
  const toggleLabel = showFullText
    ? "Voir moins"
    : captureUrl
      ? "... Voir plus"
      : "Voir plus";

  return (
    <div className="main-description">
      <div
        className="description-text"
        style={
          descriptionMarginLeft !== undefined
            ? { marginLeft: `${descriptionMarginLeft}px` }
            : undefined
        }
      >
        <span className="description-content">{descriptionText}</span>

        {shouldShowToggle && (
          <div className={`see-more-section ${showFullText ? "expanded" : ""}`}>
            <button
              className={`see-more-button ${showFullText ? "expanded" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullText((prev) => !prev);
              }}
              aria-label={showFullText ? "Voir moins" : "Voir plus"}
            >
              {toggleLabel}
            </button>
          </div>
        )}

        {showFullText && captureUrl && (
          <div className="inline-capture">
            <img
              src={captureUrl}
              alt="Capture du problème"
              onClick={(e) => {
                e.stopPropagation();
                setShowCapturePreview(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularReportContent;
