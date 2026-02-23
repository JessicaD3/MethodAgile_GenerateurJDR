export function Header() {
  return (
    <header className="app-header">
      <div className="title-container">
        <h1>Le Grimoire des Héros</h1>
        <p className="subtitle">
          Générateur de Personnages pour Donjons & Dragons 5ème Édition
        </p>
        <p>Forgez le destin de votre aventurier et préparez-vous à l'épopée</p>
      </div>

      <div className="auth-panel">
        <div className="auth-status">
          <div className="user-avatar">
            <i className="fas fa-user-helmet-safety" />
          </div>
          <div className="user-info">
            <div className="user-name">Aventurier Inconnu</div>
            <div className="user-role">Non connecté</div>
          </div>
        </div>

        <div className="auth-buttons">
          <button className="auth-btn">
            <i className="fas fa-sign-in-alt" /> Se Connecter
          </button>
          <button className="auth-btn register">
            <i className="fas fa-user-plus" /> Créer un Compte
          </button>
        </div>
      </div>
    </header>
  );
}