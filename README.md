📜 Le Grimoire des Héros

Application web de génération et gestion de personnages Donjons & Dragons 5e développée avec Next.js, MongoDB et TypeScript.

🚀 Installation & Lancement
1️⃣ Prérequis
Avant de lancer le projet, assure-toi d’avoir installé :

Node.js (version 18+ recommandée)
npm ou yarn
MongoDB (local ou MongoDB Atlas)

Vérifier les versions :
node -v
npm -v

2️⃣ Cloner le projet
git clone <url-du-repo>
cd grimoire-des-heros

3️⃣ Installer les dépendances
npm install

4️⃣ Configuration des variables d’environnement
Créer un fichier à la racine du projet :
.env.local

Ajouter :
MONGODB_URI=mongodb://127.0.0.1:27017/grimoire
JWT_SECRET=une_clef_secrete_tres_complexe

5️⃣ Lancer MongoDB
Si MongoDB est installé en local :
mongod
Ou utiliser MongoDB Compass.

6️⃣ Lancer l’application
npm run dev

Puis ouvrir :
http://localhost:3000

🧩 Fonctionnalités
Authentification (register / login / logout)
Génération aléatoire de personnages DnD
Intégration API DnD (races / classes)
Génération stats 4d6 drop lowest
Sauvegarde en base MongoDB
Bibliothèque personnelle
Suppression de personnage
Interface fantasy immersive
