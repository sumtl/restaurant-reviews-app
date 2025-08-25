"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Page de modification du profil utilisateur
// Permet à l'utilisateur de modifier son nom d'affichage (profil)
export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fonction asynchrone unifiée pour charger le nom d'affichage depuis l'API
  async function load() {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/login");
      return;
    }
    try {
      const response = await fetch("/api/users/profile", {
        headers: {
          "X-User-Email": email,
        },
      });
      const data = await response.json();
      if (data.success && data.data.name) {
        setName(data.data.name);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  }

  // Chargement initial du nom d'affichage lors du montage du composant
  useEffect(() => {
    load();
  }, []);

  // Soumettre la modification du profil (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": email,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profil mis à jour avec succès!");
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setMessage("Erreur: " + data.error);
      }
    } catch {
      setMessage("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Rendu principal : formulaire de modification du profil
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/profile" style={{ color: "#666", textDecoration: "none" }}>
          ← Retour au profil
        </Link>
      </div>

      <h1>Modifier mon profil</h1>

      {/* Formulaire de modification du nom d'affichage */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Nom d'affichage:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Votre nom d'affichage"
          />
          <small style={{ color: "#666" }}>
            Laissez vide pour rester anonyme
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#e31837",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: message.includes("Erreur") ? "#ffebee" : "#e8f5e8",
            color: message.includes("Erreur") ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
