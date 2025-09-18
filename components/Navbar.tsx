"use client";

import Link from "next/link";
import {  usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser, 
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


// Barre de navigation principale
export default function Navbar() {
  // Récupération du chemin actuel
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    // Barre de navigation principale
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm mb-8">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Lien Accueil */}
          <Button
            variant="ghost"
            className={
              pathname === "/"
                ? "bg-orange-600 text-white font-bold hover:bg-orange-700"
                : "bg-white text-gray-700 hover:bg-orange-600 hover:text-white"
            }
            asChild
          >
            <Link href="/">Accueil</Link>
          </Button>
          {/* Lien Tous les avis */}
          <Button
            variant="ghost"
            className={
              pathname === "/reviews/all"
                ? "bg-orange-600 text-white font-bold hover:bg-orange-700"
                : "bg-white text-gray-700 hover:bg-orange-600 hover:text-white"
            }
            asChild
          >
            <Link href="/reviews/all">Tous les avis</Link>
          </Button>
          {/* Lien Mes avis (visible si connecté) */}
          <SignedIn>
            <Button
              variant="ghost"
              className={
                pathname.startsWith("/reviews") &&
                !pathname.startsWith("/reviews/all")
                  ? "bg-orange-600 text-white font-bold hover:bg-orange-700"
                  : "bg-white text-gray-700 hover:bg-orange-600 hover:text-white"
              }
              asChild
            >
              <Link href="/reviews">Mes avis</Link>
            </Button>
          </SignedIn>
          {/* Lien Tous les plats */}
          <Button
            variant="ghost"
            className={
              pathname.startsWith("/menu-items")
                ? "bg-orange-600 text-white font-bold hover:bg-orange-700"
                : "bg-white text-gray-700 hover:bg-orange-600 hover:text-white"
            }
            asChild
          >
            <Link href="/menu-items">Tous les plats</Link>
          </Button>
        </div>
        {/* Actions utilisateur à droite */}
        <div className="flex items-center gap-3">
          <SignedIn>
            {isLoaded && (
              <span className="text-gray-700 text-sm hidden sm:inline">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            )}
            <Button
              variant="outline"
              className="hover:bg-orange-600 hover:text-white"
            >
              <Link href="/profile" className="text-sm">
                Mon profil
              </Link>
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button
              variant="outline"
              className="hover:bg-orange-600 hover:text-white"
            >
              <SignInButton mode="modal">
                <span>Se connecter</span>
              </SignInButton>
            </Button>
            <Button
              variant="outline"
              className="hover:bg-orange-600 hover:text-white"
            >
              <SignUpButton mode="modal">
                <span>S'inscrire</span>
              </SignUpButton>
            </Button>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
