import { useLoginModal } from "@src/components/context/LoginModalContext";
import React, { useState } from "react";
import { useAuth } from "../../../services/AuthContext"; // Pour mettre à jour l'utilisateur globalement
import "./LoginModal.scss";
import { loginUser } from "@src/services/apiService";
import { useHandleAuthRedirect } from "@src/hooks/useHandleAuthRedirect";
import { showToast } from "@src/utils/toastUtils";
import logoUsearly from "/assets/icons/usearly.svg";

export const LoginModal = () => {
  const { isOpen, closeLoginModal } = useLoginModal();
  const { handleAuthRedirect } = useHandleAuthRedirect();
  const { login } = useAuth();

  // États du formulaire
  const [email, setEmail] = useState(""); // C'est ton "loginInput"
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState(""); // AJOUT : Nécessaire pour setError

  // AJOUT : La fonction utilitaire que tu utilises dans le login classique
  const isEmail = (value: string) => value.includes("@");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: isEmail(email) ? email : undefined,
        pseudo: !isEmail(email) ? email : undefined,
        password,
        rememberMe,
      });

      // 1. Gestion de l'erreur renvoyée par l'API
      if (!response || response.success === false) {
        const msg = response?.message || "Identifiants invalides.";
        setError(msg);
        showToast(`❌ ${msg}`); // AJOUT : Déclenche le toast d'erreur
        return;
      }

      const ok = handleAuthRedirect(response, {
        onSuccess: async () => {
          if (response.accessToken && response.user) {
            await login(
              response.accessToken,
              {
                avatar: response.user.avatar ?? "",
                type: "user",
              },
              rememberMe,
            );

            showToast("✅ Connexion réussie !");
            closeLoginModal();
          }
        },
      });

      if (!ok) return;
    } catch (err: any) {
      const errorMsg = err.message || "Erreur de connexion";
      setError(errorMsg);
      showToast(`⚠️ ${errorMsg}`); // AJOUT : Déclenche le toast pour les erreurs réseau/crash
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={closeLoginModal}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={closeLoginModal}>
          &times;
        </button>

        <div className="login-header">
          {/* REMPLACEMENT DU "U." PAR LE LOGO SVG */}
          <div className="logo-container">
            <img src={logoUsearly} alt="Logo Usearly" className="login-logo" />
          </div>
          <h2>Connexion</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Chargement..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas encore de compte ?{" "}
            <a href="/signup">Créer un compte sur Usearly</a>
          </p>
        </div>
      </div>
    </div>
  );
};
