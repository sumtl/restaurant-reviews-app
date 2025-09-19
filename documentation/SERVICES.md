# Documentation des services API

## Endpoints principaux

### Reviews (Avis)
- `GET /api/reviews`  
  Récupérer la liste de tous les avis.
- `POST /api/reviews`  
  Créer un nouvel avis (authentification via Clerk session requise).
- `GET /api/reviews/{id}`  
  Obtenir un avis par son ID.
- `PUT /api/reviews/{id}`  
  Modifier un avis (l'utilisateur doit être l'auteur, authentification via Clerk session).
- `DELETE /api/reviews/{id}`  
  Supprimer un avis (l'utilisateur doit être l'auteur, authentification via Clerk session).
- `GET /api/reviews/by-menu/{menuItemId}`  
  Obtenir les avis d'un menu item spécifique.
- `GET /api/reviews/by-user`  
  Obtenir les avis de l'utilisateur connecté (authentification via Clerk session requise).

### Menu Items
- `GET /api/menu-items`  
  Récupérer la liste de tous les plats.
- `GET /api/menu-items/{id}`  
  Obtenir un plat par son ID.

### Utilisateurs
- `GET /api/users`  
  Récupérer la liste de tous les utilisateurs (authentification via Clerk session).
- `GET /api/users/profile`  
  Obtenir le profil de l'utilisateur actuellement connecté (authentification via Clerk session requise).
- `PUT /api/users/profile`  
  Mettre à jour le profil de l'utilisateur actuellement connecté (authentification via Clerk session).
- `POST /api/users`  
  Créer un nouvel utilisateur (authentification via Clerk session).

### Documentation
- `GET /api/swagger`  
  Récupérer la spécification OpenAPI/Swagger.

---

**Codes HTTP**
Codes d’erreur courants et messages**
- **200 OK**
  - GET /api/menu-items/{id}
  - GET /api/menu-items
  - GET /api/reviews/{id}
  - GET /api/reviews/by-menu/{menuItemId}
  - GET /api/reviews/by-user
  - GET /api/reviews
  - GET /api/users/profile
  - PUT /api/reviews/{id}
  - PUT /api/users/profile
  - GET /api/users
  - POST /api/users (utilisateur existant)
- **201 Created**
  - POST /api/users
  - POST /api/reviews 
- **400 Bad Request**  
  - PUT /api/reviews/{id} (Données invalides ou manquantes)
  - POST /api/reviews (Données invalides, utilisateur non trouvé, avis déjà existant)
  - POST /api/users (Adresse email manquante)
  - PUT /api/users/profile (Données invalides ou manquantes)
- **401 Unauthorized**  
  - GET /api/reviews/by-user (Authentification requise via Clerk session)
  - POST /api/reviews (Utilisateur non authentifié)
  - POST /api/users (Utilisateur non authentifié)
  - GET /api/users/profile (Non authentifié)
  - PUT /api/users/profile (Non authentifié)
- **403 Forbidden**  
  - DELETE /api/reviews/{id} (Non autorisé à supprimer cet avis )
  - PUT /api/reviews/{id} (Non autorisé à modifier cet avis)
- **404 Not Found**  
  - GET /api/menu-items/{id} (Menu item non trouvé)
  - GET /api/reviews/{id} (Avis non trouvé)
  - DELETE /api/reviews/{id} (Avis non trouvé)
  - PUT /api/reviews/{id} (Avis non trouvé)
  - GET /api/reviews/by-menu/{menuItemId} (Menu item non trouvé)
  - GET /api/users/profile (Utilisateur non trouvé)
  - PUT /api/users/profile (Utilisateur non trouvé)
- **500 Internal Server Error**  
  - GET /api/reviews, GET /api/reviews/by-user, GET /api/reviews/by-menu/{menuItemId} : Erreur lors de la récupération des avis  
  - POST /api/reviews : Erreur lors de la création de l’avis  
  - PUT /api/reviews/{id} : Erreur lors de la modification de l’avis  
  - DELETE /api/reviews/{id} : Erreur lors de la suppression de l’avis  
  - GET /api/users : Erreur lors de la récupération des utilisateurs  
  - GET /api/users/profile : Erreur lors de la récupération du profil  
  - PUT /api/users/profile : Erreur lors de la mise à jour du profil  
  - POST /api/users : Erreur lors de la création de l'utilisateur  
  - GET /api/menu-items, GET /api/menu-items/{id} : Erreur serveur

---
**Tests et documentation**  
- Les tests d’API ont été réalisés avec des fichiers api.http (Visual Studio Code) et la documentation Swagger (voir `/api-docs` dans l’application).  
- La spécification complète des endpoints et des schémas de données se trouve dans le fichier `swagger.json` (voir dossier documentation).  
- Vous pouvez explorer et tester chaque endpoint via l’interface Swagger intégrée.