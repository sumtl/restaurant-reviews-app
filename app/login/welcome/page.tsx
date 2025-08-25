"use client";

// Page de bienvenue pour les nouveaux utilisateurs après inscription ou connexion
export default function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">
        Bienvenue ! 
      </h1>
      <p className="text-lg text-gray-700 mb-6 font-medium">
        Merci de vous être inscrit ! Voici comment profiter pleinement du site :
      </p>
      <hr className="my-6" />
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2 text-blue-700">1. Mon profil</h2>
          <ul className="list-disc list-inside text-gray-700 ml-2">
            <li>Cliquez sur <b>Mon profil</b> dans la barre de navigation pour ajouter ou modifier votre nom.</li>
            <li>Consultez <b>Mes statistiques</b> : nombre d'avis publiés.</li>
            <li>Accédez à <b>Mes avis</b> pour voir, modifier ou supprimer tous vos commentaires.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-blue-700">2. Mes avis</h2>
          <ul className="list-disc list-inside text-gray-700 ml-2">
            <li>Ajoutez un avis depuis la page <b>Mes Avis</b> ou directement depuis la fiche d'un plat.</li>
            <li>Notez de 1 à 5 <span className="text-yellow-500">⭐</span> et partagez vos impressions.</li>
            <li>Vous pouvez modifier ou supprimer vos avis à tout moment.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-blue-700">3. Tous les plats</h2>
          <ul className="list-disc list-inside text-gray-700 ml-2">
            <li>Parcourez tous les plats disponibles et découvrez les notes moyennes et commentaires.</li>
            <li>Cliquez sur un plat pour voir les avis détaillés ou ajouter le vôtre.</li>
          </ul>
        </div>
      </div>
      <hr className="my-8" />
      <div className="bg-gray-50 rounded p-4 mb-6">
        <p className="italic text-gray-700 mb-2">Besoin d'aide ? Utilisez la barre de navigation en haut pour accéder rapidement à chaque section.</p>
      </div>
      <div className="text-center text-lg font-bold text-orange-600 mt-6">
        Bon appétit et amusez-vous bien ! 
      </div>
    </div>
  );
}
