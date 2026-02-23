"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Tabs } from "./Tabs";

// Composant principal de l'application qui gère l'affichage du header, des onglets et du contenu associé
export function AppShell() {
  const [activeTab, setActiveTab] = useState<"creation" | "library">("creation");

  return (
    <div className="container">
      <Header />

      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="tabs-container">
        {activeTab === "creation" && (
          <div className="tab-content active" id="creation-tab">
            <div className="main-content">
              <div className="character-form">
                <h3 className="form-title">
                  <i className="fas fa-user" /> Identité du Personnage
                </h3>
                {/* Formulaire viendra étape suivante */}
              </div>

              <div className="character-sheet">
                <div className="sheet-header">
                  <h2 className="character-name">Sans nom</h2>
                  <p className="character-details">Race Classe de niveau 1</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="tab-content active" id="library-tab">
            <div className="library-content">
              <h2>Bibliothèque des Aventuriers</h2>
              <p>Connexion requise pour afficher la bibliothèque.</p>
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          Le Grimoire des Héros - Outil de création de personnages DnD 5e ©
          2026
        </p>
      </footer>
    </div>
  );
}