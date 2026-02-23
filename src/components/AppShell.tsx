"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Tabs } from "./Tabs";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { useAuth } from "./useAuth";
import { CharacterBuilder } from "./CharactersBuilder";
import { Library } from "./Library";

export function AppShell() {
  const { user, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"creation" | "library">("creation");

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="container">
      <Header
        user={user}
        onLogout={logout}
        onLogin={() => setLoginOpen(true)}
        onRegister={() => setRegisterOpen(true)}
      />

      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="tabs-container">

        {activeTab === "creation" && (
          <div className="tab-content active" id="creation-tab">
            <CharacterBuilder user={user} />
          </div>
        )}

        {activeTab === "library" && (
          <div className="tab-content active" id="library-tab">
          <Library 
            user={user} 
            onLoginClick={() => setLoginOpen(true)} 
/>
          </div>
        )}

      </div>

      {/* MODALS */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={refreshUser}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={refreshUser}
      />

      <footer>
        <p>
          Le Grimoire des Héros - Outil de création de personnages DnD 5e ©
          2026
        </p>
      </footer>
    </div>
  );
}