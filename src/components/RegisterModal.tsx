"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

// Composant de modal d'inscription qui affiche un formulaire pour que l'utilisateur puisse créer un compte
export function RegisterModal({ isOpen, onClose, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  async function handleRegister() {
    setMessage(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setMessage(data.error || "Erreur d'inscription");
      return;
    }

    setError(false);
    setMessage("Compte créé !");
    onSuccess();

    setTimeout(() => {
      onClose();
      setUsername("");
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

        <h3 className="modal-title">Créer un Compte</h3>

        <div className="form-row">
          <label className="form-label">Nom d'aventurier</label>
          <input
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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
          <button className="modal-btn primary" onClick={handleRegister}>
            Créer mon Compte
          </button>
        </div>
      </div>
    </div>
  );
}