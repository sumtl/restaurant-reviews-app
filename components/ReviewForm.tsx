import React from "react";
import { MenuItem } from "@/types";
import StarRating from "@/components/StarRating";

// Formulaire pour créer ou éditer un avis
// Props : mode (création/édition), menuItems (plats), formData (état du formulaire), setFormData (maj état), onSubmit, onCancel, loading
interface ReviewFormProps {
  mode: "create" | "edit";
  menuItems: MenuItem[];
  formData: { menuItemId: string; rating: number; comment: string };
  setFormData: (data: {
    menuItemId: string;
    rating: number;
    comment: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// Formulaire principal pour avis (création/édition)
function ReviewForm({
  mode,
  menuItems,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading = false,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        {/* Sélection du plat du menu */}
        <label className="block text-sm font-medium mb-2">Plat du menu</label>
        <select
          value={formData.menuItemId}
          onChange={(e) =>
            setFormData({ ...formData, menuItemId: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
          disabled={loading}
        >
          <option value="">Sélectionnez un plat</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {/* Sélection de la note */}
        <label className="block text-sm font-medium mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
          editable={!loading}
        />
        {formData.rating === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur les étoiles pour donner une note (1-5)
          </p>
        )}
      </div>
      <div>
        {/* Champ commentaire */}
        <label className="block text-sm font-medium mb-2">Commentaire</label>
        <textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Partagez votre expérience..."
          required
          disabled={loading}
        />
      </div>
      <div className="flex gap-2">
        {/* Boutons valider/annuler */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {mode === "create" ? "Créer l'avis" : "Mettre à jour l'avis"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
