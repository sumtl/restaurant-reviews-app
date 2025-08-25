"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Review, User } from "@/types";

// Page de profil utilisateur
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fonction asynchrone pour charger les infos du profil et les avis
  async function load() {
    // Vérifier l'email utilisateur
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/login");
      return;
    }
    try {
      // Charger les infos utilisateur
      const userResponse = await fetch("/api/users/profile", {
        headers: {
          "X-User-Email": email,
        },
      });
      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.data);
      }
      // Charger tous les avis et filtrer ceux de l'utilisateur
      const reviewsResponse = await fetch("/api/reviews");
      const reviewsData = await reviewsResponse.json();
      if (reviewsData.success) {
        const myReviews = reviewsData.data.filter(
          (review: Review) => review.user.email === email
        );
        setUserReviews(myReviews);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Déconnexion utilisateur
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  // Affichage si l'utilisateur n'est pas trouvé
  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Erreur</h1>
        <p>Impossible de charger le profil utilisateur.</p>
      </div>
    );
  }

  // Rendu principal du profil utilisateur
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Lien retour (optionnel) */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "#666", textDecoration: "none" }}></Link>
      </div>

      {/* Bloc infos utilisateur */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1 style={{ color: "#e31837", marginBottom: "10px" }}>
              Mon Profil
            </h1>
            <p style={{ margin: "5px 0" }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Nom:</strong> {user.name || "Non défini"}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
              Membre depuis:{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Actions utilisateur : modifier et déconnexion */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/profile/edit"
              style={{
                backgroundColor: "#e31837",
                color: "white",
                padding: "8px 16px",
                textDecoration: "none",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              Modifier
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#fff",
                color: "#666",
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Bloc statistiques utilisateur */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Mes statistiques</h3>
        <p style={{ margin: "5px 0" }}>
          <strong>{userReviews.length}</strong> avis publiés
        </p>
        {userReviews.length > 0 && (
          <p style={{ margin: "5px 0" }}>
            Note moyenne donnée:{" "}
            <strong>
              {(
                userReviews.reduce((sum, review) => sum + review.rating, 0) /
                userReviews.length
              ).toFixed(1)}
              /5
            </strong>
          </p>
        )}
      </div>

      {/* Liste des avis de l'utilisateur */}
      <h2>Mes avis</h2>

      {userReviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
          }}
        >
          <p>Vous n'avez pas encore publié d'avis.</p>
          <p>
            <Link href="/" style={{ color: "#e31837" }}>
              Parcourez le menu pour laisser votre premier avis !
            </Link>
          </p>
        </div>
      ) : (
        userReviews.map((review) => (
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
                <h4 style={{ margin: "0 0 5px 0", color: "#e31837" }}>
                  <Link
                    href={`/menu-items/${review.menuItem.id}`}
                    style={{ color: "#e31837", textDecoration: "none" }}
                  >
                    {review.menuItem.name}
                  </Link>
                </h4>
                {/* Affichage de la note en étoiles */}
                <div>{"⭐".repeat(review.rating)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <small style={{ color: "#666" }}>
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                </small>
                <br />
                <Link
                  href={`/reviews/${review.id}`}
                  style={{
                    color: "#e31837",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Modifier
                </Link>
              </div>
            </div>

            {/* Commentaire de l'utilisateur */}
            <p style={{ margin: "10px 0", lineHeight: "1.5" }}>
              {review.comment}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
