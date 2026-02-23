"use client";

type Props = {
  active: "creation" | "library";
  onChange: (tab: "creation" | "library") => void;
};

export function Tabs({ active, onChange }: Props) {
  return (
    <div className="tabs">
      <div
        className={`tab ${active === "creation" ? "active" : ""}`}
        onClick={() => onChange("creation")}
      >
        <i className="fas fa-hammer tab-icon" />
        Forgeron de Héros
      </div>

      <div
        className={`tab ${active === "library" ? "active" : ""}`}
        onClick={() => onChange("library")}
      >
        <i className="fas fa-book tab-icon" />
        Bibliothèque des Aventuriers
      </div>
    </div>
  );
}