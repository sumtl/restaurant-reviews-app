"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Barre de navigation principale
export default function Navbar() {
  // État pour stocker l'email de l'utilisateur connecté
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Au montage, récupérer l'email depuis le localStorage si présent
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserEmail(localStorage.getItem("userEmail"));
    }
  }, []);

  // Déconnexion : supprimer l'email, rediriger et recharger la page
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
    window.location.reload();
  };

  return (
    // Barre de navigation principale
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm mb-8">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Lien Accueil */}
          <Link
            href="/"
            className={`text-xl font-bold px-2 py-1 rounded transition-colors duration-150 ${
              pathname === "/"
                ? "text-orange-600 font-bold underline underline-offset-4"
                : "text-orange-700 hover:underline hover:bg-gray-100"
            }`}
          >
            Accueil
          </Link>
          {/* Lien Tous les avis */}
          <Link
            href="/reviews/all"
            className={`px-2 py-1 rounded transition-colors duration-150 ${
              pathname.startsWith("/reviews/all")
                ? "text-orange-600 font-bold underline underline-offset-4"
                : "text-gray-700 hover:text-orange-600 hover:underline hover:bg-gray-100"
            }`}
          >
            Tous les avis
          </Link>
          {/* Lien Mes avis (visible si connecté) */}
          {userEmail && (
            <Link
              href="/reviews"
              className={`px-2 py-1 rounded transition-colors duration-150 ${
                pathname.startsWith("/reviews") &&
                !pathname.startsWith("/reviews/all")
                  ? "text-orange-600 font-bold underline underline-offset-4"
                  : "text-gray-700 hover:text-orange-600 hover:underline hover:bg-gray-100"
              }`}
            >
              Mes avis
            </Link>
          )}
          {/* Lien Tous les plats */}
          <Link
            href="/menu-items"
            className={`px-2 py-1 rounded transition-colors duration-150 ${
              pathname.startsWith("/menu-items")
                ? "text-orange-600 font-bold underline underline-offset-4"
                : "text-gray-700 hover:text-orange-600 hover:underline hover:bg-gray-100"
            }`}
          >
            Tous les plats
          </Link>
        </div>
        {/* Actions utilisateur à droite */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            // Si connecté : afficher email, profil et bouton déconnexion
            <>
              <span className="text-gray-700 text-sm hidden sm:inline">
                {userEmail}
              </span>
              <Link
                href="/profile"
                className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Mon profil
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            // Si non connecté : bouton Se connecter
            <Link
              href="/login"
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
