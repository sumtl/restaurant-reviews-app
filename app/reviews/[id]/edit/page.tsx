"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Review } from "@/types";

// Page d'édition d'un avis utilisateur
export default function EditReviewPage() {
  const router = useRouter(); // Pour la navigation
  const params = useParams(); // Pour lire l'id de l'avis
  const reviewId = params.id as string;

  // États principaux
  const [review, setReview] = useState<Review | null>(null); // Avis à éditer
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
  } | null>(null); // Utilisateur courant
  const [loading, setLoading] = useState(true); // Chargement en cours
  const [saving, setSaving] = useState(false); // Enregistrement/suppression en cours
  const [error, setError] = useState(""); // Message d'erreur

  // États du formulaire
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });

  // Charger l'avis à éditer depuis l'API
  useEffect(() => {
    async function load() {
      // Vérifier l'utilisateur connecté
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        setCurrentUser({ id: userEmail, email: userEmail });
      } else {
        const userData = localStorage.getItem("user");
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        } else {
          router.push("/login");
          return;
        }
      }
      // Charger l'avis
      try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        if (response.ok) {
          const reviewData = await response.json();
          const data = reviewData.data || reviewData;
          setReview(data);
          setFormData({
            rating: data.rating,
            comment: data.comment,
          });
        } else if (response.status === 404) {
          setError("Avis non trouvé");
        } else {
          setError("Erreur lors du chargement de l'avis");
        }
      } catch {
        setError("Erreur lors du chargement de l'avis");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reviewId, router]);

  // Soumettre la modification de l'avis (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review || !currentUser) return;

    if (!formData.rating || !formData.comment.trim()) {
      setError("Tous les champs sont requis");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": currentUser.email,
        },
        body: JSON.stringify({
          ...formData,
          menuItemId: review.menuItem?.id,
        }),
      });
      if (response.ok) {
        router.push("/reviews");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la mise à jour de l'avis");
      }
    } catch {
      setError("Erreur de réseau");
    } finally {
      setSaving(false);
    }
  };

  // Supprimer l'avis (DELETE)
  const handleDelete = async () => {
    if (!review || !currentUser) return;

    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet avis ? Cette action ne peut pas être annulée."
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "X-User-Email": currentUser.email,
        },
      });

      if (response.ok) {
        // Rediriger vers la page des avis après suppression
        router.push("/reviews");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la suppression de l'avis");
      }
    } catch {
      setError("Erreur de réseau");
    } finally {
      setSaving(false);
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">Chargement de l'avis...</div>
      </div>
    );
  }

  // Affichage si aucun avis trouvé ou erreur
  if (!review) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="text-center">Avis non trouvé</div>
        )}
        <div className="text-center mt-4">
          <a href="/reviews" className="text-blue-500 hover:underline">
            ← Retour à mes avis
          </a>
        </div>
      </div>
    );
  }

  // Rendu principal : formulaire d'édition et infos de l'avis
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Modifier l'avis</h1>
        <p className="text-gray-600">
          Modification de votre avis pour{" "}
          <strong>{review.menuItem?.name || "(plat inconnu)"}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Menu Item Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-4">
            <Image
              src={review.menuItem.imageUrl || "/placeholder.png"}
              alt={review.menuItem?.name || "Plat"}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded"
            />
          <div>
            <h3 className="font-bold text-lg">
              {review.menuItem?.name || "(plat inconnu)"}
            </h3>
            {review.menuItem?.description && (
              <p className="text-gray-600 text-sm">
                {review.menuItem.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Note</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  !saving && setFormData({ ...formData, rating: star })
                }
                className={`text-2xl transition-colors focus:outline-none ${
                  star <= formData.rating ? "text-yellow-500" : "text-gray-300"
                } ${
                  saving
                    ? "cursor-not-allowed"
                    : "hover:text-yellow-400 cursor-pointer"
                }`}
                disabled={saving}
                aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
              >
                {star <= formData.rating ? "★" : "☆"}
              </button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({formData.rating}/5)
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Commentaire</label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Partagez votre expérience avec ce plat..."
            required
            disabled={saving}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Enregistrement..." : "Mettre à jour l'avis"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/reviews")}
            disabled={saving}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {saving ? "Suppression..." : "Supprimer l'avis"}
          </button>
        </div>
      </form>

      {/* Historique de l'avis */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="font-medium text-gray-600 mb-2">Historique de l'avis</h3>
        <div className="text-sm text-gray-500">
          <p>
            Écrit initialement le :{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {review.updatedAt !== review.createdAt && (
            <p>
              Dernière modification :{" "}
              {new Date(review.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
