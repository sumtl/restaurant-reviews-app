"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuItem, Review } from "@/types";
import { useUser } from "@clerk/nextjs";

// Page de détails du plat par ID
export default function MenuItemPage({ params }: { params: { id: string } }) {
  // États pour stocker les infos du plat, les avis, l'email utilisateur, etc.
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();

  // Fonction asynchrone unifiée pour charger les infos du plat et ses avis
  useEffect(() => {
    async function load() {
      // Vérifier l'état de connexion
      try {
        const menuResponse = await fetch(`/api/menu-items/${params.id}`);
        const menuData = await menuResponse.json();
        if (menuData.success) {
          setMenuItem(menuData.data);
        }
        const reviewsResponse = await fetch(`/api/reviews/by-menu/${params.id}`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  // Composant pour afficher la note en étoiles
  // Affiche les étoiles selon la note
  const StarRating = ({ rating }: { rating: number }) => {
    return <div className="flex">{"⭐".repeat(rating)}</div>;
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  // Affichage si le plat n'est pas trouvé
  if (!menuItem) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Menu item non trouvé</h1>
        <Link href="/">Retour à page d'accueil</Link>
      </div>
    );
  }

  // Affichage principal : infos du plat, bouton ajouter un avis, liste des avis
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Link
          href="/menu-items"
          style={{
            display: "inline-block",
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#2563eb",
            padding: "7px 18px",
            borderRadius: "5px",
            fontWeight: 500,
            fontSize: "15px",
            textDecoration: "none",
            transition: "border-color 0.2s, color 0.2s",
            cursor: "pointer",
          }}
        >
          Choisir un autre plat
        </Link>
      </div>

      {/* Info du menu item */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "30px",
          display: "flex",
          gap: "28px",
          alignItems: "flex-start",
        }}
      >
        {/* Colonne gauche : image + nom */}
        <div
          style={{
            minWidth: "160px",
            maxWidth: "220px",
            flex: "0 0 180px",
            textAlign: "center",
          }}
        >
          {menuItem.imageUrl && (
            <Image
              src={menuItem.imageUrl}
              alt={menuItem.name}
              width={180}
              height={140}
              style={{
                width: "100%",
                maxWidth: "180px",
                height: "auto",
                borderRadius: "8px",
                marginBottom: "12px",
                objectFit: "cover",
              }}
            />
          )}
          <h1
            style={{
              color: "#e31837",
              marginBottom: "0",
              fontSize: "1.3rem",
              fontWeight: 700,
            }}
          >
            {menuItem.name}
          </h1>
        </div>
        {/* Colonne droite : description, note, avis, bouton */}
        <div style={{ flex: 1 }}>
          {menuItem.description && (
            <p style={{ color: "#666", marginBottom: "15px" }}>
              {menuItem.description}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>Note moyenne: {averageRating}/5</strong>
              <div>{"⭐".repeat(Math.round(Number(averageRating)))}</div>
            </div>
            <div>
              <strong>{reviews.length}</strong> avis
            </div>
          </div>
          {isSignedIn && user && (
            <div style={{ marginTop: "10px" }}>
              <button
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "16px",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                  transition: "background 0.2s",
                }}
                onClick={() => {
                  window.location.href = `/reviews?menuItemId=${params.id}`;
                }}
              >
                Ajouter un avis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Liste des avis */}
      <h2>
        Avis des clients
        <span
          style={{
            color: "#2563eb",
            fontWeight: 500,
            marginLeft: 8,
            fontSize: "1rem",
          }}
        >
          ({reviews.length})
        </span>
      </h2>

      {reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
          }}
        >
          <p>Aucun avis pour ce plat.</p>
          {user && isSignedIn && <p>Soyez le premier à laisser un avis !</p>}
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <div>
                <StarRating rating={review.rating} />
              </div>
              <small style={{ color: "#666" }}>
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </small>
            </div>

            <p style={{ margin: "10px 0", lineHeight: "1.5" }}>
              {review.comment}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <small style={{ color: "#888" }}>
                Par: {review.user?.name || "Client anonyme"}
              </small>

              {user && isSignedIn && user.id === review.user?.id && (
                <Link
                  href={`/reviews/${review.id}/edit`}
                  style={{
                    color: "#e31837",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Modifier
                </Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
