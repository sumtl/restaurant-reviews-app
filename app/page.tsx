import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
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
            Bienvenue sur le Food Court Costco !
          </h1>
          <p className="text-lg md:text-2xl text-gray-800 font-medium mb-6 drop-shadow-lg">
            Découvrez, partagez et explorez les meilleurs plats avec la
            communauté !
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <a
            href="/menu-items"
            className="inline-block bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow hover:bg-orange-700 transition"
          >
            Découvrir le menu
          </a>
          <a
            href="/reviews/all"
            className="inline-block bg-white text-orange-600 font-bold py-2 px-6 rounded-full border-2 border-orange-600 shadow hover:bg-orange-50 transition"
          >
            Voir tous les avis
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-md mt-4 md:mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 mt-6 text-orange-600 font-sans">
          🎯 Comment ça marche ?
        </h2>
        <ul className="list-disc list-inside text-gray-700 ml-2 mb-8 space-y-2">
          <li>Consultez les avis et notes des autres gourmands</li>
          <li>Parcourez le menu pour découvrir tous les plats disponibles</li>
          <li>
            Connectez-vous pour publier vos propres avis et gérer votre profil
          </li>
        </ul>
        <hr className="my-8 border-gray-200" />
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-orange-600 font-sans">
          🚀 Prochaines fonctionnalités
        </h2>
        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="italic text-gray-700 mb-2">*À venir bientôt :*</p>
          <ul className="list-disc list-inside text-gray-700 ml-2 space-y-2">
            <li>
              <span className="font-semibold text-orange-700">
                ✅ Plus de restaurants
              </span>{" "}
              - Étendez votre expérience culinaire
            </li>
            <li>
              <span className="font-semibold text-orange-700">
                💳 Système de paiement intégré
              </span>{" "}
              - Commandez et payez en ligne
            </li>
            <li>
              <span className="font-semibold text-orange-700">
                🛒 Achat direct
              </span>{" "}
              - Réservez vos plats préférés à l'avance
            </li>
            <li>
              <span className="font-semibold text-orange-700">
                🎯 Recommandations personnalisées
              </span>{" "}
              - Selon vos goûts et avis
            </li>
          </ul>
        </div>
        <div className="text-center text-lg font-bold text-orange-600 mt-6 font-sans">
          Bon appétit et amusez-vous bien !
          <span role="img" aria-label="party" className="ml-2">
            🎉
          </span>
        </div>
      </div>
    </div>
  );  
}