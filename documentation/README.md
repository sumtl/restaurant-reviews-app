# Restaurant Reviews App

Une plateforme de notation et d’avis pour les plats d’un restaurant (exemple : Costco Food Court).

## Description du projet

Ce projet permet aux utilisateurs de :
- Consulter les plats disponibles et leurs avis.
- Laisser, modifier ou supprimer un avis sur un plat.
- Noter chaque plat avec un système d’étoiles et commentaire.
- Gérer leur profil utilisateur.

**Domaine métier choisi :**
- Reviews sur des plats d’un restaurant unique (Costco food court pour la V1).
- Modèle extensible pour plusieurs restaurants, menus, paiement, recommandations, etc. dans les futures versions.
---
## Installation et configuration

```bash
git clone <repo>
cd restaurant-reviews-app
npm install
npx prisma generate
npx prisma db push
npm run dev
```

> ⚠️ **Configurer la base de données** : renseigner la connexion PostgreSQL dans le fichier `.env` à la racine du projet.

## 🏗️ Architecture technique et choix de conception

### Stack technique

- **Next.js 14 (App Router)** : Routing, pages et API RESTful.
- **Prisma ORM (PostgreSQL)** : Accès, migrations et relations de la base de données.
- **TypeScript** : Typage statique, robustesse et sécurité.
- **Tailwind CSS** : Design responsive et composants UI modernes.
- **Swagger** : Documentation interactive et testable de l’API.
- **Zod** : Validation stricte des données côté API.
---
### Structure fonctionnelle et parcours utilisateur

- **Authentification** :
	- Inscription et connexion par email (création automatique de l’utilisateur à la première connexion).
	- Modification du nom d’utilisateur possible depuis le profil.
	- Authentification requise pour toute action d’ajout, modification ou suppression d’avis.

- **Gestion des avis (reviews)** :
	- Un utilisateur connecté peut ajouter un avis (note + commentaire) sur chaque plat, mais un seul avis par plat (contrainte unique).
	- Un utilisateur peut modifier ou supprimer uniquement ses propres avis.
	- Les utilisateurs non connectés peuvent consulter la liste des plats et des avis, mais ne peuvent pas interagir.

- **Gestion des plats (menu items)** :
	- Tous les utilisateurs peuvent consulter la liste des plats et les détails.

- **Gestion du profil utilisateur** :
	- Chaque utilisateur peut consulter et modifier son profil (nom).

- **Sécurité et validation** :
	- Toutes les routes sensibles vérifient l’authentification via le header `X-User-Email`.
	- Les entrées utilisateur sont validées côté API (Zod) et les erreurs sont explicites.
---
### Structure principale du projet (arborescence code)

- `/app` : Contient toutes les pages principales de l’application (UI) et les routes API (Next.js App Router).	
	- `api/` : Dossier des routes API (voir `documentation/SERVICES.md` pour le détail).
	- `api-docs/` : Page de documentation interactive de l’API (Swagger UI).
	- `page.tsx` : Page d’accueil (landing page).
	- `login/` : Pages de connexion et d’accueil après connexion.
	- `menu-items/` : Pages de liste et détail des plats.
	- `profile/` : Pages de profil utilisateur (voir, éditer).
	- `reviews/` : Pages de gestion des avis (tous les avis, mes avis, édition).
- `/components` : Composants React réutilisables facilitant la construction de l’interface utilisateur.
	- `ReviewForm` : Formulaire pour créer ou modifier un avis (note + commentaire).
	- `ReviewList` : Affichage de la liste des avis pour un plat ou un utilisateur.
	- `ReviewCard` : Carte individuelle affichant le détail d’un avis (auteur, note, commentaire, actions).
	- `StarRating` : Composant interactif d’affichage et de saisie de la note sous forme d’étoiles.
	- `Navbar` : Barre de navigation principale de l’application (liens, connexion, etc.).
- `/prisma` : Fichiers liés à la base de données Prisma :
	- `schema.prisma` : Modèle de données principal (tables, relations, contraintes).
	- `seed.ts` : Script de peuplement de la base de données avec des données d’exemple.
- `/lib` : Fonctions utilitaires et helpers partagés (ex : configuration Prisma, middlewares, outils d’authentification).
	- `prisma.ts` : Singleton de connexion à la base de données Prisma pour éviter la recréation du client à chaque appel (optimisation Next.js).
	- `rating.ts` : Schéma de validation Zod pour les avis (note, commentaire, contraintes de validation pour la création/modification d’un avis).
	- `swagger.ts` : Configuration et génération de la documentation Swagger/OpenAPI pour l’API REST (définitions, schémas, endpoints, etc.).
- `/types` : Définitions TypeScript personnalisées 
	- `index.ts` : Définit les interfaces principales utilisées dans l’application :
	    - `Review` : Structure d’un avis (note, commentaire, auteur, plat concerné, dates).
		- `MenuItem` : Structure d’un plat (nom, description, image, date de création).
		- `User` : Structure d’un utilisateur (id, email, nom, dates).
- `/documentation` : Documentation du projet :
	- `README.md` : Présentation générale, instructions, architecture, captures d’écran, etc.
	- `CODE_ANALYSIS.md` : Analyse détaillée du code, choix techniques, patterns utilisés.
	- `SERVICES.md` : Détail des services/API, endpoints, schémas de réponse/erreur.
	- `swagger.json` : Spécification OpenAPI générée pour l’API REST, utilisée pour la documentation interactive (Swagger UI) et les outils tiers.
	- `screenshots/` : Captures d’écran de l’application pour la documentation.

- `/public` : Fichiers statiques accessibles publiquement. Ce projet contient uniquement les images des plats du menu utilisées pour illustrer chaque plat dans l’interface.
	- `images/costco-food/` : Dossier contenant toutes les images des plats 
- `/test` : Fichiers de test et utilitaires de test :
	- `api.http` : Fichier de requêtes HTTP pour tester les endpoints de l’API (utilisé avec VS Code REST Client).
  
---
## 📸 Captures d’écran

### Pages générales
- **Page d’accueil** (landing page, non connecté)  
	![](./screenshots/home.png)

- **Page de connexion** (login)  
	![](./screenshots/login.png)

- **Page d’accueil après connexion** (vue personnalisée)  
	![](./screenshots/home-connected.png)



### Parcours plats & avis
- **Liste des plats** (menu)  
	![](./screenshots/menu-list.png)

- **Détail d’un plat** (avec liste d’avis)  
	![](./screenshots/menu-detail.png)

- **Tous les avis**  
	![](./screenshots/reviews-all.png)

- **Tous les avis (pagination，si le nombre d’avis dépasse 10)**
	![](./screenshots/reviews-pagination.png)

- **Mes avis**   
	![](./screenshots/reviews-mine.png)

- **Formulaire de création d’avis**  
	![](./screenshots/review-create.png)

- **Création d’avis réussie**  
	![](./screenshots/review-create-success.png)

- **Erreur : note manquante**  
	![](./screenshots/review-missing-rating-error.png)

- **Erreur : commentaire manquant**  
	![](./screenshots/review-missing-comment-error.png)

- **Erreur : avis déjà existant** 
	![](./screenshots/review-duplicate-error.png)

- **Formulaire de modification d’avis** (pré-rempli avec les informations existantes)  
	![](./screenshots/review-edit-prefilled.png)

- **Modification d’avis réussie**  
	![](./screenshots/review-modify-success.png)

- **Suppression d’un avis** (confirmation ou résultat)  
	![](./screenshots/review-delete.png)

### Utilisateur
- **Profil utilisateur** (vue) 
	![](./screenshots/profile-view.png)

- **Profil utilisateur** (édition)  
	![](./screenshots/profile-edit.png)


### Documentation API intégrée (Swagger UI)
- **Partie 1 :**
    ![](./screenshots/swagger-ui-part1.png)

- **Partie 2 :**
    ![](./screenshots/swagger-ui-part2.png)

---
## 🚀 Instructions de déploiement (Vercel)

1. Créez un compte sur [Vercel](https://vercel.com/) si ce n’est pas déjà fait.
2. Cliquez sur « New Project » et importez ce repository GitHub.
3. Lors de la configuration du projet :
	- Renseignez les variables d’environnement nécessaires (ex : `DATABASE_URL` pour PostgreSQL).
	- Vérifiez que le framework détecté est bien **Next.js**.
4. Lancez le déploiement.
5. Une fois le build terminé, l’application sera accessible à l’URL fournie par Vercel.

> Pour toute modification, poussez simplement sur la branche principale : Vercel redéploiera automatiquement.