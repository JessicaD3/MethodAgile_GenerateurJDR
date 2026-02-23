"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  user: {
    _id: string;
    username: string;
    email: string;
  } | null;
};

type Stats = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

type DndList = {
  results: { index: string; name: string }[];
};

function roll4d6DropLowest() {
  const rolls = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 6) + 1
  ).sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

export function CharacterBuilder({ user }: Props) {
  const [races, setRaces] = useState<DndList | null>(null);
  const [classes, setClasses] = useState<DndList | null>(null);

  const [name, setName] = useState("Aelar le Téméraire");
  const [raceIndex, setRaceIndex] = useState("");
  const [classIndex, setClassIndex] = useState("");

  const [stats, setStats] = useState<Stats>({
    str: 15,
    dex: 14,
    con: 13,
    int: 12,
    wis: 10,
    cha: 8,
  });

  const [story, setStory] = useState(
    "Décrivez ici l'histoire de votre personnage..."
  );

  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"success" | "error">(
    "success"
  );

  // Load DnD data
  useEffect(() => {
    (async () => {
      const [rRes, cRes] = await Promise.all([
        fetch("/api/dnd/races"),
        fetch("/api/dnd/classes"),
      ]);

      const rData = await rRes.json();
      const cData = await cRes.json();

      setRaces(rData);
      setClasses(cData);

      setRaceIndex(rData?.results?.[0]?.index ?? "");
      setClassIndex(cData?.results?.[0]?.index ?? "");
    })();
  }, []);

  const raceName = useMemo(
    () =>
      races?.results.find((r) => r.index === raceIndex)?.name ?? "Race",
    [races, raceIndex]
  );

  const className = useMemo(
    () =>
      classes?.results.find((c) => c.index === classIndex)?.name ?? "Classe",
    [classes, classIndex]
  );

  async function generateName() {
    const res = await fetch("/api/names?ancestry=h&family=t");
    const data = await res.json();
    if (res.ok) setName(data.name);
  }

  function generateRandomRace() {
  if (!races?.results?.length) return;
  const random =
    races.results[Math.floor(Math.random() * races.results.length)];
  setRaceIndex(random.index);
}

function generateRandomClass() {
  if (!classes?.results?.length) return;
  const random =
    classes.results[Math.floor(Math.random() * classes.results.length)];
  setClassIndex(random.index);
}

  function generateAllStats() {
    setStats({
      str: roll4d6DropLowest(),
      dex: roll4d6DropLowest(),
      con: roll4d6DropLowest(),
      int: roll4d6DropLowest(),
      wis: roll4d6DropLowest(),
      cha: roll4d6DropLowest(),
    });
  }

  async function generateFullCharacter() {
  await generateName();
  generateRandomRace();
  generateRandomClass();
  generateAllStats();
}

  function rollOne(key: keyof Stats) {
    setStats((prev) => ({
      ...prev,
      [key]: roll4d6DropLowest(),
    }));
  }

  async function saveCharacter() {
    if (!user) {
      setMessageKind("error");
      setMessage("Vous devez être connecté pour sauvegarder.");
      return;
    }

    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        race: raceName,
        class: className,
        stats,
        story,
      }),
    });

    if (!res.ok) {
      setMessageKind("error");
      setMessage("Erreur lors de la sauvegarde.");
      return;
    }

    setMessageKind("success");
    setMessage("Personnage sauvegardé !");
  }

  return (
    <div className="main-content">
      {/* ===== FORMULAIRE GAUCHE ===== */}
      <div className="character-form">

        <div className="form-section">
            <h3 className="form-title">
                <i className="fas fa-user" /> Identité du Personnage
            </h3>

            {/* NOM */}
            <div className="form-group">
                <label>
                Nom du Personnage
                <button
                    type="button"
                    className="dice-btn"
                    onClick={generateName}
                >
                    <i className="fas fa-dice-d6" />
                </button>
                </label>

                <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* RACE */}
            <div className="form-group">
                <label>
                Race
                <button
                    type="button"
                    className="dice-btn"
                    onClick={generateRandomRace}
                >
                    <i className="fas fa-dice-d6" />
                </button>
                </label>

                <select
                value={raceIndex}
                onChange={(e) => setRaceIndex(e.target.value)}
                >
                {(races?.results ?? []).map((r) => (
                    <option key={r.index} value={r.index}>
                    {r.name}
                    </option>
                ))}
                </select>
        </div>

        {/* CLASSE */}
        <div className="form-group">
            <label>
            Classe
            <button
                type="button"
                className="dice-btn"
                onClick={generateRandomClass}
            >
                <i className="fas fa-dice-d6" />
            </button>
            </label>

            <select
            value={classIndex}
            onChange={(e) => setClassIndex(e.target.value)}
            >
            {(classes?.results ?? []).map((c) => (
                <option key={c.index} value={c.index}>
                {c.name}
                </option>
            ))}
            </select>
        </div>
        </div>

        <hr className="section-divider" />

        <div className="form-section">
        <h3 className="form-title">
            <i className="fas fa-dice-d20 section-icon" />
            Caractéristiques
        </h3>

        <p className="form-helper">
            Cliquez sur les dés pour générer aléatoirement ou entrez vos valeurs manuellement
        </p>

        {(
            [
            ["str", "Force"],
            ["dex", "Dextérité"],
            ["con", "Constitution"],
            ["int", "Intelligence"],
            ["wis", "Sagesse"],
            ["cha", "Charisme"],
            ] as const
        ).map(([key, label]) => (
            <div className="form-group stat-group" key={key}>
            <label className="stat-label">
                {label}
                <button
                type="button"
                className="dice-btn"
                onClick={() => rollOne(key)}
                >
                <i className="fas fa-dice-d6" />
                </button>
            </label>

            <input
                type="number"
                value={stats[key]}
                onChange={(e) =>
                setStats((s) => ({
                    ...s,
                    [key]: Number(e.target.value),
                }))
                }
            />
            </div>
        ))}
        </div>

        <hr className="section-divider" />

        <div className="buttons-container">
          <button className="btn" onClick={generateFullCharacter}>
            <i className="fas fa-wand-sparkles" /> Générer Aléatoire
          </button>

          <button className="btn" onClick={saveCharacter}>
            <i className="fas fa-save" /> Sauvegarder
          </button>
        </div>

        {message && (
          <div className={`form-message ${messageKind}`}>
            {message}
          </div>
        )}
      </div>

      {/* ===== FICHE DROITE ===== */}
      <div className="character-sheet">
        <div className="sheet-header">
          <h2 className="character-name">{name}</h2>
          <p className="character-details">
            {raceName} {className} de niveau 1
          </p>
        </div>

        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div className="stat-box" key={key}>
              <div className="stat-label">{key.toUpperCase()}</div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>

        <div className="sheet-section">
          <h3 className="sheet-section-title">Histoire du Personnage</h3>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            style={{ width: "100%", minHeight: 120 }}
          />
        </div>
      </div>
    </div>
  );
}