export default function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">Bienvenue !</h1>
      <p className="text-lg text-gray-700 mb-6 font-medium">
        Merci de vous être inscrit ! Voici comment profiter pleinement du site :
      </p>
      <hr className="my-6 border-gray-200" />
      <div className="space-y-8">
        <div className="flex items-start">
          <div className="bg-orange-600 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-600">Mon profil</h2>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>
                Cliquez sur{" "}
                <span className="font-semibold text-700">Mon profil</span> dans
                la barre de navigation pour ajouter ou modifier votre nom.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-orange-600 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-600">Mes avis</h2>
            <ul className="list-disc list-inside text-gray-700 ml-2 space-y-3">
              <li>
                Pour ajouter un avis, cliquez sur{" "}
                <span className="font-semibold text-700">
                  Écrire un nouvel avis
                </span>{" "}
                dans la page{" "}
                <span className="font-semibold text-700">Mes Avis</span>,
                sélectionnez le plat dans le menu déroulant, cliquez sur les
                étoiles pour donner une note, ajoutez un commentaire, puis
                cliquez sur{" "}
                <span className="font-semibold text-700">Créer l'avis</span>{" "}
                pour valider ou sur{" "}
                <span className="font-semibold text-700">Annuler</span> pour
                revenir à la liste de vos avis.
              </li>
              <li>
                La note (1 à 5 <span className="text-yellow-500">⭐</span>) et
                le commentaire sont obligatoires.
              </li>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 my-2 rounded">
                <b>Important :</b> Vous ne pouvez écrire qu'un seul avis par
                plat.Vous pouvez toutefois modifier ou supprimer votre avis à
                tout moment.
              </div>             
              <li>
                Pour chaque avis que vous avez écrit, vous trouverez les boutons{" "}
                <span className="font-semibold text-orange-700">Modifier</span>{" "}
                et{" "}
                <span className="font-semibold text-orange-700">Supprimer</span>
                :
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>
                    En cliquant sur{" "}
                    <span className="font-semibold text-700">Modifier</span>, le
                    formulaire s'ouvre avec les informations de l'avis déjà
                    remplies. Cliquez sur{" "}
                    <span className="font-semibold text-700">
                      Mettre à jour l'avis
                    </span>{" "}
                    pour valider les modifications, sur{" "}
                    <span className="font-semibold text-700">Annuler</span> pour
                    revenir à la liste, ou sur{" "}
                    <span className="font-semibold text-700">
                      Supprimer l'avis
                    </span>{" "}
                    pour supprimer définitivement l'avis.
                  </li>
                  <li>
                    En cliquant directement sur{" "}
                    <span className="font-semibold text-700">Supprimer</span> à
                    côté d'un avis, vous pouvez le supprimer rapidement sans
                    passer par le formulaire.
                  </li>
                </ul>
              </li>
              <li>
                Le nombre total de vos avis s'affiche à côté du titre « Mes avis
                ».
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-orange-600 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-600">Tous les plats</h2>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>Parcourez tous les plats disponibles.</li>
              <li>
                Cliquez sur un plat pour voir la note moyenne, les commentaires
                des autres utilisateurs et le nombre total d'avis pour ce plat.
                Si vous êtes connecté, vous verrez aussi le bouton{" "}
                <span className="font-semibold text-700">Ajouter un avis</span>{" "}
                pour publier votre propre commentaire. Si vous souhaitez revenir
                à la liste de tous les plats, cliquez simplement sur{" "}
                <span className="font-semibold text-700">
                  Choisir un autre plat
                </span>{" "}
                en haut à droite.
              </li>
              <li>
                Seuls les utilisateurs connectés peuvent ajouter un nouvel avis.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-8 border-gray-200" />
      <div className="text-center text-lg font-bold text-orange-600 mt-6">
        Bon appétit et amusez-vous bien !
        <span role="img" aria-label="party" className="ml-2">
          🎉
        </span>
      </div>
    </div>
  );
}
