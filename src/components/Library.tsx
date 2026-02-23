"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  user: {
    _id: string;
    username: string;
    email: string;
  } | null;
  onLoginClick?: () => void;
};

type Character = {
  _id: string;
  name: string;
  race: string;
  class: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  createdAt: string;
};

type SortField = "name" | "race" | "class" | "strength" | "date";

export function Library({ user, onLoginClick }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterRace, setFilterRace] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  async function fetchCharacters() {
    if (!user) return;

    setLoading(true);
    const res = await fetch("/api/characters");
    const data = await res.json();

    if (res.ok) {
      setCharacters(data.characters);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCharacters();
  }, [user]);

  // =========================
  // FILTRAGE
  // =========================

  const filteredCharacters = useMemo(() => {
    let result = [...characters];

    if (filterName) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterRace) {
      result = result.filter((c) => c.race === filterRace);
    }

    if (filterClass) {
      result = result.filter((c) => c.class === filterClass);
    }

    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortField) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "race":
          valueA = a.race;
          valueB = b.race;
          break;
        case "class":
          valueA = a.class;
          valueB = b.class;
          break;
        case "strength":
          valueA = a.stats.str;
          valueB = b.stats.str;
          break;
        case "date":
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
      }

      if (sortDirection === "desc") {
        return valueA > valueB ? -1 : 1;
      } else {
        return valueA < valueB ? -1 : 1;
      }
    });

    return result;
  }, [characters, filterName, filterRace, filterClass, sortField, sortDirection]);

  // =========================
  // STATS
  // =========================

  const stats = useMemo(() => {
    if (filteredCharacters.length === 0)
      return {
        total: 0,
        avgStr: 0,
        dominantRace: "-",
        dominantClass: "-",
      };

    const total = filteredCharacters.length;
    const avgStr = Math.round(
      filteredCharacters.reduce((acc, c) => acc + c.stats.str, 0) / total
    );

    const raceMap: Record<string, number> = {};
    const classMap: Record<string, number> = {};

    filteredCharacters.forEach((c) => {
      raceMap[c.race] = (raceMap[c.race] || 0) + 1;
      classMap[c.class] = (classMap[c.class] || 0) + 1;
    });

    const dominantRace = Object.keys(raceMap).reduce((a, b) =>
      raceMap[a] > raceMap[b] ? a : b
    );

    const dominantClass = Object.keys(classMap).reduce((a, b) =>
      classMap[a] > classMap[b] ? a : b
    );

    return { total, avgStr, dominantRace, dominantClass };
  }, [filteredCharacters]);

  if (!user) {
  return (
    <div className="library-content">

      <div className="library-header">
        <h2 className="library-title">
          Bibliothèque des Aventuriers
        </h2>
        <p className="library-subtitle">
          Explorez la galerie des héros créés par la communauté
        </p>
        <div className="library-divider"></div>
      </div>

      <div className="library-locked">

        <div className="lock-icon">
          <i className="fas fa-lock"></i>
        </div>

        <h3>Bibliothèque Réservée aux Membres</h3>

        <p>
          Connectez-vous pour accéder à votre collection de personnages
          et explorer ceux de la communauté.
        </p>

            <button 
            className="btn login-btn"
            onClick={onLoginClick}
            >
          <i className="fas fa-sign-in-alt"></i>
          Se connecter
        </button>

      </div>

    </div>
  );
}

  return (
    <div className="library-content">

      {/* HEADER */}
        <div className="library-header">
            <h2 className="library-title">
                Bibliothèque des Aventuriers
            </h2>

            <p className="library-subtitle">
                Explorez les héros forgés dans votre grimoire
            </p>

            <div className="library-divider"></div>
        </div>

      {/* FILTRES */}
      <div className="library-filters">
        <h3 className="filters-title">
          <i className="fas fa-filter" /> Filtres & Tri
        </h3>

        <div className="filters-container">

          <div className="filter-group">
            <label>Nom</label>
            <input
              className="filter-input"
              placeholder="Rechercher..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Race</label>
            <select
              className="filter-select"
              value={filterRace}
              onChange={(e) => setFilterRace(e.target.value)}
            >
              <option value="">Toutes</option>
              {[...new Set(characters.map((c) => c.race))].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Classe</label>
            <select
              className="filter-select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">Toutes</option>
              {[...new Set(characters.map((c) => c.class))].map((cl) => (
                <option key={cl}>{cl}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="library-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Personnages</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.dominantRace}</div>
          <div className="stat-label">Race dominante</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.dominantClass}</div>
          <div className="stat-label">Classe dominante</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.avgStr}</div>
          <div className="stat-label">Force moyenne</div>
        </div>
      </div>

      {/* CARDS */}
      {loading && <p>Chargement...</p>}

        <div className="characters-grid">
        {filteredCharacters.map((char) => (
            <div key={char._id} className="character-card">

            <div className="card-header">
                <h3 className="card-name">{char.name}</h3>
                <div className="card-class">
                <i className="fas fa-shield-alt" /> {char.class}
                </div>
                <div className="card-race">{char.race}</div>
            </div>

            <div className="card-stats">

            <div className="stats-row">
                <div className="mini-stat">
                <span>FOR</span>
                <strong>{char.stats.str}</strong>
                </div>

                <div className="mini-stat">
                <span>DEX</span>
                <strong>{char.stats.dex}</strong>
                </div>

                <div className="mini-stat">
                <span>CON</span>
                <strong>{char.stats.con}</strong>
                </div>
            </div>

            <div className="stats-row">
                <div className="mini-stat">
                <span>INT</span>
                <strong>{char.stats.int}</strong>
                </div>

                <div className="mini-stat">
                <span>WIS</span>
                <strong>{char.stats.wis}</strong>
                </div>

                <div className="mini-stat">
                <span>CHA</span>
                <strong>{char.stats.cha}</strong>
                </div>
            </div>

            </div>

            <div className="card-footer">
                Créé le{" "}
                {new Date(char.createdAt).toLocaleDateString("fr-FR")}
            </div>

            </div>
        ))}
        </div>

    </div>
  );
}