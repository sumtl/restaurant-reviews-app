export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">
        Bienvenue sur le Food Court Costco !
      </h1>
      <p className="text-lg text-gray-700 mb-6 font-medium">
        Découvrez, partagez et explorez les meilleurs plats du food court Costco
        avec la communauté !
      </p>
      <hr className="my-6" />
      <h2 className="text-2xl font-semibold mb-2 mt-6">
        🎯 Comment ça marche ?
      </h2>
      <ul className="list-disc list-inside text-gray-700 ml-2 mb-8">
        <li>Consultez les avis et notes des autres gourmands</li>
        <li>Parcourez le menu pour découvrir tous les plats disponibles</li>
        <li>
          Connectez-vous pour publier vos propres avis et gérer votre profil
        </li>
      </ul>
      <hr className="my-8" />
      <h2 className="text-2xl font-semibold mb-2">
        🚀 Prochaines fonctionnalités
      </h2>
      <div className="bg-gray-50 rounded p-4 mb-6">
        <p className="italic text-gray-700 mb-2">*À venir bientôt :*</p>
        <ul className="list-disc list-inside text-gray-700 ml-2">
          <li>
            <span className="font-semibold">✅ Plus de restaurants</span> -
            Étendez votre expérience culinaire
          </li>
          <li>
            <span className="font-semibold">
              💳 Système de paiement intégré
            </span>
            - Commandez et payez en ligne
          </li>
          <li>
            <span className="font-semibold">🛒 Achat direct</span> - Réservez
            vos plats préférés à l'avance
          </li>
          <li>
            <span className="font-semibold">
              🎯 Recommandations personnalisées
            </span>
            - Selon vos goûts et avis
          </li>
        </ul>
      </div>
      <div className="text-center text-lg font-bold text-orange-600 mt-6">
        Bon appétit et amusez-vous bien !
        <span role="img" aria-label="party">
          🎉
        </span>
      </div>
    </div>
  );
}
