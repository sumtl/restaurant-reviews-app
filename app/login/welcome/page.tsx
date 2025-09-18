"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function WelcomePage() {
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/users", { method: "POST" });
    }
  }, [isSignedIn, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-10">
        <Image
          src="/images/costco-food/costco-food.png"
          alt="Food court Costco"
          fill
          className="absolute inset-0 w-full h-full object-cover rounded-b-lg opacity-70"
          priority
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-600 drop-shadow-lg font-sans">
            Bienvenue, {user?.firstName || "utilisateur"} !
          </h1>
          <p className="text-lg md:text-2xl text-gray-800 font-medium mb-6 drop-shadow-lg">
            Merci de vous être inscrit ! Profitez pleinement du site et partagez
            vos avis gourmands.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <a
              href="/reviews"
              className="inline-block bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow hover:bg-orange-700 transition"
            >
              Publier un avis
            </a>
            <a
              href="/profile"
              className="inline-block bg-white text-orange-600 font-bold py-2 px-6 rounded-full border-2 border-orange-600 shadow hover:bg-orange-50 transition"
            >
              Mon profil
            </a>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-md mt-4 md:mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-orange-600 font-sans">
          🎯 Comment profiter du site ?
        </h2>
        <ul className="list-disc list-inside text-gray-700 ml-2 mb-8 space-y-2">
          <li>
            <span className="font-semibold text-orange-700">
              Barre de navigation :
            </span>{" "}
            Accédez à <span className="font-semibold">Mes avis</span>,{" "}
            <span className="font-semibold">Tous les plats</span> et{" "}
            <span className="font-semibold">Mon profil</span> à tout moment.
          </li>
          <li>
            <span className="font-semibold text-orange-700">Mes avis :</span>{" "}
            Ajoutez, modifiez ou supprimez vos avis. Cliquez sur{" "}
            <span className="font-semibold">Écrire un nouvel avis</span> pour
            commenter un plat dans la liste déroulante.
          </li>
          <li>
            <span className="font-semibold text-orange-700">
              Tous les plats :
            </span>{" "}
            Parcourez le menu, consultez la photo, la description, la note
            moyenne et les commentaires des autres utilisateurs pour chaque
            plat. Cliquez sur{" "}
            <span className="font-semibold">Ajouter un avis</span> pour publier
            votre propre commentaire sur le plat sélectionné.
          </li>
          <li>
            <span className="font-semibold text-orange-700">Mon profil :</span>{" "}
            Personnalisez votre nom et vos informations.
          </li>
        </ul>
        <div className="bg-orange-50 rounded p-4 mb-6 text-gray-700">
          <b>Astuce :</b> Vous pouvez publier un avis soit depuis{" "}
          <span className="font-semibold">Mes avis</span> (“Écrire un nouvel
          avis”), soit directement depuis{" "}
          <span className="font-semibold">Tous les plats</span> (“Ajouter un
          avis”).
        </div>
        <hr className="my-8 border-gray-200" />
        <div className="text-center text-lg font-bold text-orange-600 mt-6 font-sans">
          Bon appétit et amusez-vous bien !{" "}
          <span role="img" aria-label="party" className="ml-2">
            🎉
          </span>
        </div>
      </div>{" "}
    </div>
  );
}
