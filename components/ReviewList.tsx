import React from "react";
import { Review } from "@/types";
import ReviewCard from "./ReviewCard";

// Liste des avis
// Props : reviews (tableau d'avis), onEdit (callback édition), onDelete (callback suppression), editable (affichage boutons)
interface ReviewListProps {
  reviews: Review[];
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
  editable?: boolean;
}

// Affichage de la liste des avis
function ReviewList({
  reviews,
  onEdit,
  onDelete,
  editable = false,
}: ReviewListProps) {
  if (!reviews.length) {
    // Message si aucun avis
    return (
      <p className="text-gray-500">Vous n'avez encore écrit aucun avis.</p>
    );
  }
  return (
    <div className="space-y-2">
      {/* Affichage de chaque ReviewCard */}
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
          editable={editable}
        />
      ))}
    </div>
  );
}

export default ReviewList;
