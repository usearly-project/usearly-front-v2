import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../shared/Avatar";
import ConfirmDialog from "./ConfirmDialog";
import "./NotificationItem.scss";

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification: n,
  onMarkAsRead,
  onDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    onMarkAsRead(n.id);

    // 🆕 si la notif correspond à une mention, on ajoute le commentId dans l’URL
    const commentParam = n.commentId ? `?commentId=${n.commentId}` : "";

    if (n.suggestionId) {
      navigate(`/suggestions/${n.suggestionId}${commentParam}`);
    } else if (n.coupDeCoeurId) {
      navigate(`/coupsdecoeur/${n.coupDeCoeurId}${commentParam}`);
    } else if (n.descriptionId || n.description?.id) {
      navigate(
        `/reports/description/${n.descriptionId || n.description?.id}${commentParam}`,
      );
    } else {
      console.warn("⚠️ Notification sans lien exploitable:", n);
    }
  };

  const renderMessage = () => {
    switch (n.type) {
      case "suggestion_share":
        return "vous a partagé une suggestion 💡";
      case "coupdecoeur_share":
        return "vous a partagé un coup de cœur 💖";
      case "mention":
        return "vous a mentionné dans un commentaire 💬";
      default:
        return "vous a envoyé une notification 🔔";
    }
  };

  return (
    <div
      key={n.id}
      className={`notif-item-header ${n.read ? "read" : "unread"}`}
      onClick={handleNavigate}
    >
      <Avatar
        avatar={n.sender?.avatar}
        pseudo={n.sender?.pseudo || "Utilisateur"}
        type="user"
        wrapperClassName="notif-avatar"
      />

      <div className="notif-text">
        <p className="notif-message">
          <strong>{n.sender?.pseudo || "Un utilisateur"}</strong>{" "}
          {renderMessage()}
        </p>

        {n.type !== "mention" && n.message && (
          <p className="notif-subtext">{n.message}</p>
        )}

        <span className="notif-time">
          {new Date(n.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="notif-actions">
        <button
          className="notif-more"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmDeleteId(n.id);
          }}
          aria-label="Ouvrir les actions de la notification"
        >
          <i className="fa fa-ellipsis-v" />
        </button>

        {confirmDeleteId === n.id && (
          <ConfirmDialog
            message="Voulez-vous supprimer cette notification ?"
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={() => onDelete(n.id)}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
