import React from "react";
import { Review } from "@/types";

// Carte pour afficher un avis individuel
// Props : review (avis à afficher), onEdit (callback édition), onDelete (callback suppression), editable (affichage boutons)
interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
  editable?: boolean;
}

// Affichage principal de la carte d'avis
function ReviewCard({
  review,
  onEdit,
  onDelete,
  editable = false,
}: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm mb-2">
      <div className="flex justify-between items-start mb-2">
        <div>
          {/* Nom du plat et note en étoiles */}
          <h3 className="font-bold text-lg">{review.menuItem.name}</h3>
          <div className="text-yellow-500 text-xl">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>
        {/* Boutons Modifier/Supprimer si editable */}
        {editable && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit && onEdit(review)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Modifier
            </button>
            <button
              onClick={() => onDelete && onDelete(review.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      {/* Commentaire de l'utilisateur */}
      <p className="text-gray-700 mb-2">{review.comment}</p>
      {/* Date de création de l'avis */}
      <p className="text-sm text-gray-500">
        Écrit le {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ReviewCard;
