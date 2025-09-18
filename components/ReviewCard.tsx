import React from "react";
import { Review } from "@/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";

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
    <Card className="mb-2">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div>
          <h3 className="font-bold text-lg">{review.menuItem.name}</h3>
          <div className="text-yellow-500 text-xl">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>
        {editable && (
          <div className="flex gap-2">
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              size="sm"
              onClick={() => onEdit && onEdit(review)}
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete && onDelete(review.id)}
            >
              Supprimer
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-2">{review.comment}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Écrit le {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}

export default ReviewCard;
