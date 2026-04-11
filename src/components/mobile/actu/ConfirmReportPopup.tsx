import React, { useState } from "react";
import { Hand, Loader2 } from "lucide-react"; // Loader pour le feedback visuel
import "./ConfirmReportPopup.scss";
import iconReport from "/assets/icons/signal-icon-white.svg";

interface Props {
  item: any;
  description: string;
  count: number;
  onClose: () => void;
  // onConfirm doit maintenant retourner une Promise pour gérer le loading
  onConfirm: (payload: {
    reportingId: string;
    emoji: string;
    description: string;
    subCategory: string;
  }) => Promise<void>;
}

const ConfirmReportPopup: React.FC<Props> = ({
  item,
  description,
  count,
  onClose,
  onConfirm,
}) => {
  const [text, setText] = useState(description);
  const [selectedEmoji, setSelectedEmoji] = useState("😒");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojis = ["😐", "😮", "😒", "😢", "🤯", "😱", "😡", "😂"];

  const selectedIndex = emojis.indexOf(selectedEmoji);
  const arrowLeftPosition = selectedIndex * 12.5 + 6.25;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // On prépare l'objet exactement comme attendu par ton controller
      const payload = {
        reportingId: item.id || item.reportingId, // Selon la structure de ton objet item
        emoji: selectedEmoji,
        description: text,
        subCategory: item.subCategory,
      };

      await onConfirm(payload);
      // Si succès, le parent fermera probablement la modal
    } catch (error: any) {
      console.error("Erreur signalement:", error);
      // Tu peux ajouter une petite notification d'erreur ici si besoin
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crp-overlay" onClick={onClose}>
      <div className="crp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crp-top-row">
          <div className="crp-left-content">
            <div className="crp-main-icon-container">
              <img
                src={iconReport}
                alt="Signalement"
                className="crp-header-img"
              />
            </div>
            <h3 className="crp-title">{item.subCategory}</h3>
          </div>

          <div className="crp-right-content">
            <div className="crp-count-badge">
              <span className="crp-count-nb">{count}</span>
              <div className="crp-notif-icon-container">
                <img src={iconReport} alt="Notif" className="crp-notif-img" />
              </div>
            </div>
          </div>
        </div>

        <div className="crp-bubble-section">
          <div className="crp-emoji-list">
            {emojis.map((emoji) => (
              <span
                key={emoji}
                className={`crp-emoji-unit ${selectedEmoji === emoji ? "crp-active" : ""} ${isSubmitting ? "disabled" : ""}`}
                onClick={() => !isSubmitting && setSelectedEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div className="crp-bubble-box">
            <div
              className="crp-arrow"
              style={{ left: `${arrowLeftPosition}%` }}
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <p className="crp-hint">Tu peux modifier la description si besoin</p>

        <button
          className={`crp-confirm-btn ${isSubmitting ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <>
              <Hand size={22} strokeWidth={2.5} />
              Signaler aussi ce problème
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmReportPopup;
