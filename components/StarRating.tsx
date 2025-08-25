import React from "react";

// Composant pour afficher et sélectionner une note en étoiles
// Props : rating (note), onRatingChange (callback), editable (modifiable ou non)
interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
}

function StarRating({
  rating,
  onRatingChange,
  editable = true,
}: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && onRatingChange && onRatingChange(star)}
          className={`text-2xl transition-colors ${
            editable ? "hover:text-yellow-400 cursor-pointer" : "cursor-default"
          } ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          disabled={!editable}
        >
          {star <= rating ? "★" : "☆"}
        </button>
      ))}
      {/* Affichage de la note numérique si > 0 */}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      )}
    </div>
  );
}

export default StarRating;
