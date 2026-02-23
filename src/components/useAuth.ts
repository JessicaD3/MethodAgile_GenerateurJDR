"use client";

import { useEffect, useState } from "react";

// Hook personnalisé pour gérer l'authentification de l'utilisateur
export type AuthUser = {
  _id: string;
  username: string;
  email: string;
};


// Ce hook fournit les informations de l'utilisateur connecté, un indicateur de chargement, une fonction pour rafraîchir les données de l'utilisateur et une fonction pour se déconnecter
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    refreshUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return {
    user,
    loading,
    refreshUser,
    logout,
  };
}