# Analyse du code

## Parties critiques (explication ### 2.1 Recherche utilisateur (auth### 2.3  - Utilisé dans : `GET /api/users/profile`, `PUT /api/users/profile`, `POST /api/reviews`, `POST /api/users`Récupération des avis (findMany- `/app/s- `/app/profile/page.tsx` : Affichage du profil utilisateur local (simple consultation).
- `/app/profile/edit/page.tsx` : Modification des informations du profil local (nom seulement).n-in/[[.- **Gestion de l'authentification et**Sécurité et authentification**
  - Authentification plus sécurisée : migration complète vers Clerk avec support multi-providers
  - Gestion avancée des sessions et de la sécurité via Clerk
  - Nom d'utilisateur unique (ou gestion simple des doublons)s droits** :
  - Authentification via Clerk (email, Google, autres providers disponibles).
  - Synchronisation automatique des utilisateurs Clerk avec la base de données locale via upsert.
  - Chaque route API vérifie l'authentification via Clerk session (auth() et currentUser()).
  - Seul l'auteur d'un avis peut le modifier ou le supprimer (vérification côté API).gn-in]]/page.tsx` : Authentification utilisateur Clerk (connexion).
- `/app/sign-up/[[...sign-up]]/page.tsx` : Inscription utilisateur Clerk (création de compte).
- `/app/user-profile/[[...user-profile]]/page.tsx` : Gestion complète du profil utilisateur via Clerk.vec upsert)

- `await prisma.user.upsert({ ... })` : Synchronise automatiquement les utilisateurs Clerk avec la base de données locale.
  - Utilisé dans : `GET /api/users/profile` pour créer ou mettre à jour l'utilisateur selon les données Clerk.

- `await prisma.review.findMany({ ... })` :
  - `GET /api/reviews` : Récupère tous les avis, joint les infos utilisateur et plat, trie par date.
  - `GET /api/reviews/by-user` : Récupère tous les avis d'un utilisateur donné (filtre par userId via Clerk), joint les infos utilisateur et plat.
  - `GET /api/reviews/by-menu/{menuItemId}` : Récupère tous les avis pour un plat donné (filtre par menuItemId), joint les infos utilisateur et plat.

- `await prisma.user.findMany({ ... })` : Récupère la liste de tous les utilisateurs (utilisé dans `GET /api/users`).

- `await prisma.menuItem.findMany({ ... })` : Récupère la liste de tous les plats (utilisé dans `GET /api/menu-items`).tUser)

- `const { userId } = await auth();` : 
  - Récupère l'ID utilisateur via Clerk session (auth utilisé pour vérifier l'authentification).
  - Utilisé dans : `POST /api/reviews`, `GET /api/users/profile`, `PUT /api/users/profile`, `POST /api/users`

- `const clerkUser = await currentUser();` :
  - Récupère les informations complètes de l'utilisateur depuis Clerk.
  - Utilisé dans : `GET /api/users/profile`, `PUT /api/users/profile`

- `const existingReview = await prisma.review.findUnique({ where: { id: reviewID } });`:
  - Vérifie l'existence d'un avis par son ID (findUnique utilisé ici car id est la clé primaire).
  - Utilisé dans : `GET /api/reviews/{id}`, `PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}`

- `const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });`
  - Vérifie l'existence d'un plat par son ID (findUnique utilisé ici car id est la clé primaire).
  - Utilisé dans : `GET /api/reviews/by-menu/[menuItemId]`, `GET /api/menu-items/{id}`, `POST /api/reviews`(vérification avant création d'un avis)ne)

### 1. Modèle de données (prisma/schema.prisma)

 - `model Review` (structure de l’objet retourné par l’API) :
   - `id` : Identifiant unique de l’avis (Int)
   - `comment` : Commentaire de l’utilisateur (String)
   - `rating` : Note de l’avis (Int)
   - `userId` : ID utilisateur (String)
   - `menuItemId` : ID du plat (Int)
   - `createdAt` : Date de création (DateTime ISO)
   - `updatedAt` : Date de modification (DateTime ISO)
   - `user` : Objet imbriqué utilisateur (id, name, email)
   - `menuItem` : Objet imbriqué plat (id, name)
   
   **Contraintes et relations :**
   - (contrainte DB) `@@unique([userId, menuItemId])` : Un utilisateur ne peut laisser qu’un seul avis par plat.
     - Cette contrainte est appliquée à deux niveaux :
       - **Base de données** : L’index unique `@@unique([userId, menuItemId])` bloque toute insertion doublon.
       - **API** : Avant la création d’un avis, l’API vérifie s’il existe déjà un avis pour ce couple (user, plat) et retourne une erreur explicite si c’est le cas.
   - `@relation(fields: [userId], references: [id])` : Définit la relation avec User (clé étrangère).
   - `@relation(fields: [menuItemId], references: [id])` : Définit la relation avec MenuItem (clé étrangère).

 - `model User` (structure de l’objet utilisateur) :
   - `id` : Identifiant unique de l’utilisateur (String, cuid)
   - `email` : Email de l’utilisateur (String, unique)
   - `name` : Nom de l’utilisateur (String, optionnel)
   - `createdAt` : Date de création (DateTime ISO)
   - `updatedAt` : Date de modification (DateTime ISO)
   - `reviews` : Tableau d’avis associés à l’utilisateur (Review[])
   
   **Contraintes et relations :**
   - (contrainte DB) `@unique` sur `email` : Un email ne peut être utilisé qu’une seule fois.
   - **Relation 1-N** : Un utilisateur peut avoir plusieurs avis (1 User → N Review).

 - `model MenuItem` (structure de l’objet plat) :
   - `id` : Identifiant unique du plat (Int, autoincrement)
   - `name` : Nom du plat (String, unique)
   - `description` : Description du plat (String, optionnel)
   - `imageUrl` : URL de l’image du plat (String, optionnel)
   - `createdAt` : Date de création (DateTime ISO)
   - `reviews` : Tableau d’avis associés à ce plat (Review[])
   
   **Contraintes et relations :**
   - (contrainte DB) `@unique` sur `name` : Un nom de plat ne peut être utilisé qu’une seule fois.
   - **Relation 1-N** : Un plat peut avoir plusieurs avis (1 MenuItem → N Review).
---
## 2. Traitement des données côté API (backend)

La gestion des erreurs est systématique : chaque cas (données manquantes, utilisateur non trouvé, avis déjà existant, etc.) retourne un code et un message précis. Pour le détail des types d’erreurs et des codes HTTP utilisés, voir le fichier `services.md`.

### 2.1 Recherche utilisateur (findUnique)

- `const user = await prisma.user.findUnique({ where: { email: userEmail } });` : 
  - Vérifie l’existence de l’utilisateur par email (findUnique utilisé ici car email est un champ unique).
  - Utilisé dans : `POST /api/auth/login`, `GET /api/users/profile`, `PUT /api/users/profile`, `POST /api/reviews`

- `const existingReview = await prisma.review.findUnique({ where: { id: reviewID } });`:
  - Vérifie l’existence d’un avis par son ID (findUnique utilisé ici car id est la clé primaire).
  - Utilisé dans : `GET /api/reviews/{id}`, `PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}`

- `const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });`
  - Vérifie l’existence d’un plat par son ID (findUnique utilisé ici car id est la clé primaire).
  - Utilisé dans : `GET /api/reviews/by-menu/[menuItemId]`, `GET /api/menu-items/{id}`, `POST /api/reviews`(vérification avant création d’un avis)
 
### 2.2 Vérification d’avis existant (findFirst)

- `const existingReview = await prisma.review.findFirst({ where: { userId: user.id, menuItemId } });` : Empêche la duplication d’avis pour le même plat. (findFirst est utilisé ici car c'est plus simple pour vérifier deux champs en même temps : userId + menuItemId， avec findUnique la syntaxe est plus complexe pour les contraintes composites `where: { userId_menuItemId: { userId: ..., menuItemId: ... } }`).
  - Utilisé dans : `POST /api/reviews`

### 2.3 Récupération des avis (findMany)

- `await prisma.review.findMany({ ... })` :
  - `GET /api/reviews` : Récupère tous les avis, joint les infos utilisateur et plat, trie par date.
  - `GET /api/reviews/by-user` : Récupère tous les avis d’un utilisateur donné (filtre par email via header), joint les infos utilisateur et plat.
  - `GET /api/reviews/by-menu/{menuItemId}` : Récupère tous les avis pour un plat donné (filtre par menuItemId), joint les infos utilisateur et plat.

- `await prisma.user.findMany({ ... })` : Récupère la liste de tous les utilisateurs (utilisé dans `GET /api/users`).

- `await prisma.menuItem.findMany({ ... })` : Récupère la liste de tous les plats (utilisé dans `GET /api/menu-items`).

### 2.4 Validation des données (Zod)
  - La validation des données côté API repose sur le schéma Zod reviewSchema et son utilisation via `reviewSchema.parse({ ... })` :
    - `reviewSchema` Défini dans rating.ts, il contient les règles pour valider un objet avis (userId, menuItemId, rating, comment).
    - Cette fonction vérifie que l’objet envoyé respecte bien ces règles.
    - Si les données sont valides, elle retourne l’objet validé.
    - Si les données sont invalides, elle lève une erreur ZodError avec le détail des problèmes.
    - La gestion de l’exception ZodError est utilisée dans : POST /api/reviews, PUT /api/reviews/[id]
  - Utilisé dans :
    - `POST /api/reviews` : Valide les données avant de créer un nouvel avis.
    - `PUT /api/reviews/{id}` : Valide les données avant de modifier un avis existant.
--- 
### 3. Frontend – Vue d’ensemble des pages principales

Le frontend est structuré autour de plusieurs pages Next.js, chacune ayant un rôle précis :

- `/app/page.tsx` : Page d’accueil, présentation générale de l’application.
- `/app/login/page.tsx` : Authentification utilisateur (saisie de l’email, gestion de la session).
- `/app/login/welcome/page.tsx` : Message de bienvenue après connexion.
- `/app/reviews/page.tsx` : Liste, création (bouton « Écrire un nouvel avis ») et gestion des avis de l’utilisateur connecté.
- `/app/reviews/all/page.tsx` : Page publique, liste complète de tous les avis visibles par tous les utilisateurs.
- `/app/reviews/[id]/edit/page.tsx` : Formulaire d’édition/suppression d’un avis existant, avec pré-remplissage du formulaire lors de la modification et affichage de l’historique de l’avis en bas de page.
- `/app/menu-items/page.tsx` : Page publique, affichage de la liste des plats disponibles.
- `/app/menu-items/[id]/page.tsx` : Détail d’un plat (nom, description, image), bouton « Ajouter un avis » pour publier un commentaire sur ce plat, affichage de tous les avis existants pour ce plat (tous utilisateurs) et de la note moyenne calculée dynamiquement.
- `/app/profile/page.tsx` : Affichage du profil utilisateur.
- `/app/profile/edit/page.tsx` : Modification des informations du profil: nom.
- `/app/api-docs/page.tsx` : Documentation interactive de l’API (Swagger).

### Exemple de logique métier :

**Exemple : empêcher qu’un utilisateur laisse deux avis sur le même plat et gestion des boutons**

  - Si l’utilisateur clique sur « Ajouter un avis » depuis la page d’un plat, il est redirigé vers `/reviews` avec le paramètre `menuItemId` dans l’URL.
    ```tsx
    // Dans /app/menu-items/[id]/page.tsx
    <button onClick={() => window.location.href = `/reviews?menuItemId=${params.id}`}>Ajouter un avis</button>
    ```
  - Le frontend garde en mémoire si l’utilisateur a déjà écrit un avis sur ce plat (état `alreadyReviewedMenuItemId`).
    ```tsx
    // Dans /app/reviews/page.tsx
    const [alreadyReviewedMenuItemId, setAlreadyReviewedMenuItemId] = useState<string | null>(null);
    ```
  - À chaque changement, le code cherche dans tous les avis si un avis existe déjà pour ce plat et cet utilisateur :
    ```tsx
    useEffect(() => {
      const userReview = reviews.find(
        (r) => r.user?.email === currentUser.email && r.menuItem.id === Number(menuItemIdFromUrl)
      );
      if (userReview) setAlreadyReviewedMenuItemId(menuItemIdFromUrl);
      else setAlreadyReviewedMenuItemId(null);
    }, [reviews, currentUser, searchParams]);
    ```
  - **Si un avis est trouvé :**
    - Le formulaire pour écrire un nouvel avis est caché.
    - Un bouton « Choisir un autre plat » s’affiche, permettant de revenir à la liste des plats.
    - Un message d’information s’affiche pour prévenir l’utilisateur.
    ```tsx
    {alreadyReviewedMenuItemId ? (
      <>
        <a href="/menu-items" className="...">Choisir un autre plat</a>
        <div>Vous avez déjà laissé un avis pour ce plat.</div>
      </>
    ) : (
      !showCreateForm && (
        <button onClick={handleNewOrEditClick}>Écrire un nouvel avis</button>
      )
    )}
    ```
  - **Sinon :**
    - Le bouton « Écrire un nouvel avis » apparaît (si le formulaire n’est pas déjà affiché).
    - Cliquer dessus affiche le formulaire de création d’avis, avec un bouton « Créer l’avis » pour valider.
    ```tsx
    {showCreateForm && (
      <ReviewForm ... />
    )}
    ```
  - Ce contrôle est aussi fait côté serveur :
    ```ts
    // Dans POST /api/reviews
    const existingReview = await prisma.review.findFirst({
    where: { userId: user.id, menuItemId },
    });
    if (existingReview) return NextResponse.json({ error: "Avis déjà existant" }, { status: 400 });
    ```

  Ainsi, chaque utilisateur ne peut écrire qu’un seul avis par plat, et il reçoit un message clair si c’est déjà fait, avec la possibilité de choisir un autre plat à noter.

**Exemple : pré-remplissage du formulaire lors de la modification d’un avis**
  - Lorsqu’un utilisateur clique sur « Modifier » d’un avis, le formulaire est pré-rempli avec les informations de l’avis existant.
    ```tsx
    // Dans /app/reviews/[id]/edit/page.tsx
    useEffect(() => {
      load();
    }, [reviewId, router]); 

    async function load() {
      // Vérifier l'utilisateur connecté
      // ...    
      // Charger l'avis
      const response = await fetch(`/api/reviews/${reviewId}`);
      if (response.ok) {
        const reviewData = await response.json();
        const data = reviewData.data || reviewData;
        setReview(data);
        setFormData({
          rating: data.rating,
          comment: data.comment,
        });
      }
      // ...
    }
    ```
**Exemple : affichage dynamique de la note moyenne d’un plat**
  - La note moyenne est calculée en temps réel en fonction des avis existants pour ce plat.
    ```tsx
    // Dans /app/menu-items/[id]/page.tsx
    const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;
    ```
  - Affichage des étoiles selon la note moyenne
    ```tsx
    <div>{"⭐".repeat(Math.round(Number(averageRating)))}</div>
    ```
- sélection du nombre d’étoiles lors de la création/modification d’un avis
  - Lorsqu’un utilisateur ajoute ou modifie un avis, il choisit la note en cliquant sur les étoiles du composant `StarRating`.  
    Chaque fois qu’une étoile est cliquée, la fonction `onRatingChange` met à jour la valeur `rating` dans l’état du formulaire ; cette valeur sera envoyée à l’API lors de la soumission du formulaire.
    ```tsx
    // Dans /components/ReviewForm.tsx
    <StarRating
      rating={formData.rating}
      onRatingChange={(rating) => setFormData({ ...formData, rating })}
      editable={!loading}
    />
    ```
  - Si aucune étoile n’est sélectionnée, un message d’aide s’affiche pour inviter l’utilisateur à choisir une note.
    ```tsx
    {formData.rating === 0 && (
      <p className="text-sm text-gray-500 mt-1">
        Cliquez sur les étoiles pour donner une note (1-5)
      </p>
    )}
    ```
**Exemple : affichage des étoiles lors de la sélection de la note**
  - Le composant `StarRating` affiche 5 étoiles : chaque étoile est pleine (★) si elle est sélectionnée, ou vide (☆) sinon.
  - Cliquer sur une étoile met à jour la note (`rating`) dans le formulaire.
    ```tsx
    // Dans /components/StarRating.tsx
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => editable && onRatingChange && onRatingChange(star)}
        className={`text-2xl transition-colors ${
          editable ? "hover:text-yellow-400 cursor-pointer" : "cursor-default"
        } ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        disabled={!editable}
      >
        {star <= rating ? "★" : "☆"}
      </button>
    ))}
    ```
  - La couleur et le symbole changent dynamiquement selon la note sélectionnée :  
    - `★` (jaune) = étoile sélectionnée  
    - `☆` (gris) = étoile non sélectionnée
  - La note numérique (ex : (4/5)) s’affiche à côté si une note est choisie.
    ```tsx
    {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      )}
    ```
---
### 4. Correspondance pages / APIs principales

| Page / Composant                                                                                       | API appelée / Endpoint associé                                               | Description / Rôle principal                         |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/app/page.tsx`                                                                                        | —                                                                            | Accueil de l’application.                            |
| `/app/sign-in/[[...sign-in]]/page.tsx`                                                                | Clerk Authentication                                                         | Connexion utilisateur via Clerk.                     |
| `/app/sign-up/[[...sign-up]]/page.tsx`                                                                | Clerk Authentication                                                         | Inscription utilisateur via Clerk.                   |
| `/app/user-profile/[[...user-profile]]/page.tsx`                                                      | Clerk Profile Management                                                     | Gestion complète du profil via Clerk.                |
| `/app/reviews/page.tsx`                                                                                | `GET /api/reviews`, `POST /api/reviews`                                      | Gérer les avis utilisateur.                          |
| `/app/reviews/all/page.tsx`                                                                            | `GET /api/reviews`                                                           | Voir tous les avis.                                  |
| `/app/reviews/[id]/edit/page.tsx`                                                                      | `GET /api/reviews/{id}`, `PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}` | Modifier ou supprimer un avis.                       |
| `/app/menu-items/page.tsx`                                                                             | `GET /api/menu-items`                                                        | Voir la liste des plats.                             |
| `/app/menu-items/[id]/page.tsx`                                                                        | `GET /api/menu-items/{id}`                                                   | Détail d’un plat.                                    |
| `/app/profile/page.tsx`                                                                                | `GET /api/users/profile`                                                     | Voir le profil utilisateur local.                    |
| `/app/profile/edit/page.tsx`                                                                           | `GET /api/users/profile`, `PUT /api/users/profile`                           | Modifier le profil utilisateur local.                |
| `/app/api-docs/page.tsx`                                                                               | `GET /api/swagger`                                                           | Documentation API Swagger.                           |
| (API supplémentaires accessibles via fetch ou navigation interne, non directement mappées à page.tsx:) |                                                                              |                                                      |
| `/app/menu-items/[id]/page.tsx`                                                                        | `GET /api/reviews/by-menu/{menuItemId}`                                      | Récupère les avis du plat affiché (fetch).           |
| `/app/reviews/page.tsx`                                                                                | `GET /api/reviews/by-user`                                                   | Récupère les avis de l’utilisateur connecté (fetch). |
| (gestion interne)                                                                                      | `GET /api/users`                                                             | Liste de tous les utilisateurs (usage interne).      |

---
### 5. Documentation automatique (Swagger)

  - `/** @swagger ... */` : Chaque endpoint est annoté pour générer automatiquement la documentation interactive de l’API, accessible via `/api-docs`.


---
### 6. Choix d’implémentation détaillés

- **Architecture full-stack moderne** :
  - Next.js 14 App Router pour séparer clairement pages, API et layout.
  - Prisma ORM pour la gestion des modèles, migrations et requêtes SQL sécurisées.
  - PostgreSQL comme base de données relationnelle robuste.
  - TypeScript pour la sécurité de typage sur tout le projet (frontend et backend).
  - Tailwind CSS pour un design rapide, responsive et cohérent.
  - Swagger pour la documentation et le test interactif de l’API.
  - Zod pour la validation stricte des schémas de données côté serveur.
  - ShadCN/ui pour des composants UI modernes, accessibles et réutilisables.
  - Clerk.dev pour l'authentification sécurisée et la gestion complète des utilisateurs.
  - Vercel pour l'hébergement, le déploiement continu et l'optimisation des performances.

- **Gestion de l’authentification et des droits** :
  - Authentification par email (création automatique de l’utilisateur à la première connexion).
  - Chaque route API vérifie l’email utilisateur pour les actions sensibles.
  - Seul l’auteur d’un avis peut le modifier ou le supprimer (vérification côté API).

- **Séparation stricte des responsabilités** :
  - Pages Next.js pour l’UI, routes API pour la logique métier et la persistance.
  - Composants React réutilisables pour formulaires, listes, notation étoilée, etc.

- **Validation et gestion des erreurs** :
  - Validation systématique des entrées utilisateur avec Zod (côté API).
  - Gestion centralisée des erreurs, messages explicites et codes HTTP adaptés.

- **Expérience utilisateur** :
  - Formulaires pré-remplis lors de la modification d’avis ou du profil.
  - Affichage conditionnel des boutons/actions selon l’état de connexion et les droits.
  - Feedback utilisateur clair pour chaque action (succès, erreur, accès refusé).

- **Documentation et testabilité** :
  - Endpoints API documentés avec Swagger (OpenAPI), testables via `/api-docs`.
  - Structure de code et documentation facilitant la prise en main et l’évolution du projet.

- **Patterns et bonnes pratiques** :
  - Validation systématique des entrées utilisateur.
  - Gestion centralisée des erreurs.
  - Utilisation de hooks React pour la gestion d’état et des effets.
---
### 7. Optimisations et évolutions futures

**UI/UX et expérience utilisateur**
  - Interface plus moderne et attractive (animations, transitions, responsive, couleurs, composants visuels)

**Sécurité et authentification**
  - Authentification plus sécurisée : vraie vérification d’email, mot de passe, double validation
  - Nom d’utilisateur unique (ou gestion simple des doublons)

**Gestion des utilisateurs et des droits**
  - Amélioration de la gestion des utilisateurs
  - Ajouter un espace admin : gérer les comptes, modérer les avis, donner des droits spéciaux
  - Règles simples selon besoins (ex : rôles, droits)

**Évolutions métier et extensibilité**
  - Support multi-restaurants et multi-menus
  - Si plusieurs restaurants : même nom de plat possible dans des restos différents, mais unique par resto
  - Recommandations personnalisées

**Fonctionnalités avancées**
  - Système de paiement intégré
  - Achat direct de plats

---


