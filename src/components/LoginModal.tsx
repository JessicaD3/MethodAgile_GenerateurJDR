"use client";

import { useState } from "react";

// Composant de modal de connexion qui affiche un formulaire pour que l'utilisateur puisse se connecter
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

// Ce composant affiche une modal de connexion avec un formulaire pour l'email et le mot de passe. Lors de la soumission, il envoie une requête à l'API pour tenter de connecter l'utilisateur et affiche un message de succès ou d'erreur en fonction du résultat.
export function LoginModal({ isOpen, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  async function handleLogin() {
    setMessage(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setMessage(data.error || "Erreur de connexion");
      return;
    }

    setError(false);
    setMessage("Connexion réussie !");
    onSuccess();

    setTimeout(() => {
      onClose();
      setEmail("");
      setPassword("");
    }, 1000);
  }

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>

        <h3 className="modal-title">Connexion au Grimoire</h3>

        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && (
          <div className={`form-message ${error ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="modal-buttons">
          <button className="modal-btn primary" onClick={handleLogin}>
            Se Connecter
          </button>
        </div>
      </div>
    </div>
  );
}