"use client";

import { useEffect, useState } from "react";

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
};

// Hook personnalisé pour gérer l'authentification de l'utilisateur
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les informations de l'utilisateur connecté depuis l'API
  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  // Fonction de déconnexion qui appelle l'API pour supprimer le token et met à jour l'état utilisateur
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
  }

  return {
    user,
    loading,
    refreshUser: fetchUser,
    logout,
  };
}