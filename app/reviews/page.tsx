"use client";

import { useState, useEffect,Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Review, MenuItem } from "@/types";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

// Page de gestion des avis utilisateur (créer, modifier, supprimer)
function ReviewsContent() {
  const searchParams = useSearchParams(); // Pour lire les paramètres d'URL
  const router = useRouter(); // Pour la navigation côté client

  const menuItemIdForBack = searchParams.get("menuItemId");
  // États principaux
  const [reviews, setReviews] = useState<Review[]>([]); // Liste des avis
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Liste des plats
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
  } | null>(null); // Utilisateur courant
  const [loading, setLoading] = useState(true); // Chargement en cours
  const [error, setError] = useState(""); // Message d'erreur
  const [showCreateForm, setShowCreateForm] = useState(false); // Afficher le formulaire de création
  const [newReview, setNewReview] = useState({
    menuItemId: "",
    rating: 0,
    comment: "",
  });
  // Chargement initial de l'utilisateur et des données
  useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setCurrentUser({ id: userEmail, email: userEmail });
    }
    // Charger les avis et les plats
    fetchReviews();
    fetchMenuItems();
  }, []);

  // Gérer l'ouverture du formulaire selon l'URL (édition ou création)

  // ID du plat déjà noté par l'utilisateur (si existe)
  const [alreadyReviewedMenuItemId, setAlreadyReviewedMenuItemId] = useState<
    string | null
  >(null);
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà noté ce plat
    const menuItemIdFromUrl = searchParams.get("menuItemId");
    if (!menuItemIdFromUrl || !currentUser) {
      setAlreadyReviewedMenuItemId(null);
      return;
    }
    const userEmail = currentUser.email.trim().toLowerCase();
    const userReview = reviews.find(
      (r) =>
        r.user &&
        typeof r.user.email === "string" &&
        r.user.email.trim().toLowerCase() === userEmail &&
        r.menuItem.id === Number(menuItemIdFromUrl)
    );
    if (userReview) {
      setAlreadyReviewedMenuItemId(menuItemIdFromUrl);
      setShowCreateForm(false);
    } else {
      setAlreadyReviewedMenuItemId(null);
      setNewReview((prev) => ({ ...prev, menuItemId: menuItemIdFromUrl }));
      setShowCreateForm(true);
    }
  }, [reviews, currentUser, searchParams]);

  // Charger tous les avis depuis l'API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setReviews(result.data);
        } else {
          setReviews([]);
          setError("Erreur lors du chargement des avis");
        }
      } else {
        setReviews([]);
        setError("Erreur lors du chargement des avis");
      }
    } catch {
      setReviews([]);
      setError("Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  // Charger les plats du menu depuis l'API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu-items");
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setMenuItems(result.data);
        } else {
          setMenuItems([]);
        }
      } else {
        setMenuItems([]);
      }
    } catch {
      setMenuItems([]);
    }
  };

  // Filtrer les avis de l'utilisateur courant
  const getUserReviews = () => {
    if (!currentUser || !Array.isArray(reviews)) return [];
    const userEmail = currentUser.email.trim().toLowerCase();
    return reviews.filter(
      (review) =>
        review.user &&
        typeof review.user.email === "string" &&
        review.user.email.trim().toLowerCase() === userEmail
    );
  };
  // Créer un nouvel avis (POST)
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Veuillez vous connecter d'abord");
      return;
    }
    if (newReview.rating === 0) {
      setError("⭐ Veuillez sélectionner une note en cliquant sur les étoiles");
      return;
    }
    const userEmail = currentUser.email.trim().toLowerCase();
    const alreadyReviewed = reviews.some(
      (r) =>
        r.user &&
        typeof r.user.email === "string" &&
        r.user.email.trim().toLowerCase() === userEmail &&
        r.menuItem.id === Number(newReview.menuItemId)
    );
    if (alreadyReviewed) {
      setError(
        "Vous avez déjà laissé un avis pour ce plat. Veuillez modifier votre avis existant."
      );
      return;
    }
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": currentUser.email,
        },
        body: JSON.stringify({
          menuItemId: Number(newReview.menuItemId),
          rating: Number(newReview.rating),
          comment: newReview.comment,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          await fetchReviews();
          setNewReview({ menuItemId: "", rating: 0, comment: "" });
          setShowCreateForm(false);
          setError("");
        } else {
          setError(result.error || "Erreur lors de la création de l'avis");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la création de l'avis");
      }
    } catch {
      setError("Erreur de réseau");
    }
  };

  // Supprimer un avis (DELETE)
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "X-User-Email": currentUser?.email || "",
        },
      });
      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        setError("");
        if (menuItemIdForBack) {
          router.push(`/menu-items/${menuItemIdForBack}`);
        } else {
          router.push("/reviews");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la suppression de l'avis");
      }
    } catch {
      setError("Erreur de réseau");
    }
  };

  // Affichage du chargement
  if (loading) {
    return <div className="p-8">Chargement des avis...</div>;
  }

  // Affichage si non connecté
  if (!currentUser) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Mes Avis</h1>
        <p>
          Veuillez{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            vous connecter
          </a>{" "}
          pour gérer vos avis.
        </p>
      </div>
    );
  }

  // Liste des avis de l'utilisateur courant
  const userReviews = getUserReviews();

  // Gérer le clic sur "nouvel avis" ou "éditer"
  const handleNewOrEditClick = () => {
    setShowCreateForm(true);
  };

  // Rendu principal de la page
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        {alreadyReviewedMenuItemId ? (
          <a
            href="/menu-items"
            className="bg-white border border-gray-300 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 ml-auto font-medium text-base transition-colors"
            style={{ textDecoration: "none" }}
          >
            Choisir un autre plat
          </a>
        ) : (
          !showCreateForm && (
            <button
              onClick={handleNewOrEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
            >
              Écrire un nouvel avis
            </button>
          )
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {alreadyReviewedMenuItemId ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
          Vous avez déjà laissé un avis pour ce plat. Veuillez utiliser la
          section <b>Mes Avis</b> ci-dessous pour modifier ou supprimer votre
          avis.
        </div>
      ) : (
        <>
          {showCreateForm && (
            <ReviewForm
              mode="create"
              menuItems={menuItems}
              formData={newReview}
              setFormData={setNewReview}
              onSubmit={handleCreateReview}
              onCancel={() => setShowCreateForm(false)}
              loading={loading}
            />
          )}
        </>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-2">
          Mes Avis ({userReviews.length})
        </h2>
        {/* Au clic sur "éditer", on redirige vers la page d'édition de l'avis (PUT) */}
        <ReviewList
          reviews={userReviews}
          onEdit={(review) => {
            window.location.href = `/reviews/${review.id}/edit`;
          }}
          onDelete={handleDeleteReview}
          editable={true}
        />
      </div>

      <div className="mt-8 text-center">
        <a href="/" className="text-blue-500 hover:underline"></a>
      </div>
    </div>
  );
}
export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
