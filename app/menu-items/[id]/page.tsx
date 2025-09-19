"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuItem, Review } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        const reviewsResponse = await fetch(
          `/api/reviews/by-menu/${params.id}`
        );
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
        <Button variant="outline" asChild>
          <Link href="/menu-items">Choisir un autre plat</Link>
        </Button>
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
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                size="lg"
                onClick={() => {
                  window.location.href = `/reviews?menuItemId=${params.id}`;
                }}
              >
                Ajouter un avis
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Liste des avis */}
      <h2 className="text-lg font-semibold">
        Avis des clients
        <span className="text-blue-600 font-medium ml-2">
          ({reviews.length})
        </span>
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded">
          <p>Aucun avis pour ce plat.</p>
          {user && isSignedIn && <p>Soyez le premier à laisser un avis !</p>}
        </div>
      ) : (
        reviews.map((review) => (
          <Card
            key={review.id}
            className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <StarRating rating={review.rating} />
              <small className="text-gray-600">
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </small>
            </div>
            <p className="my-2">{review.comment}</p>
            <div className="flex justify-between items-center">
              <small className="text-gray-800">
                Par: {review.user?.name || "Client anonyme"}
              </small>
              {user && isSignedIn && user.id === review.user?.id && (
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/reviews/${review.id}/edit`;
                  }}
                >
                  Modifier
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
