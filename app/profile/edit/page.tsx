"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Page de modification du profil utilisateur
// Permet à l'utilisateur de modifier son nom d'affichage (profil)
export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fonction asynchrone unifiée pour charger le nom d'affichage depuis l'API

  // Chargement initial du nom d'affichage lors du montage du composant
  useEffect(() => {
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
    load();
  }, [router]);

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
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6">Modifier mon profil</h1>
      {/* Formulaire de modification du nom d'affichage */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nom d'affichage :
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Votre nom d'affichage"
          />
          <small className="text-gray-600">
            Laissez vide pour rester anonyme
          </small>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded font-semibold text-white"
          style={{
            backgroundColor: loading ? "#ccc" : "#e31837",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-6 p-3 rounded text-center font-medium ${
            message.includes("Erreur")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
