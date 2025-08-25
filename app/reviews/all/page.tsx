import { Review } from "@/types";
import Link from "next/link";

// Page d'affichage de tous les avis (publique, paginée)
export default async function AllReviewsPage({
  searchParams = {},
}: {
  searchParams?: { page?: string };
}) {
  // Déterminer l'URL de base pour l'API
  const baseUrl =
    process.env.NEXT_PUBLIC_API ||
    (typeof window === "undefined" ? "http://localhost:3000" : "");
  
  // Récupérer tous les avis depuis l'API
  const res = await fetch(`${baseUrl}/api/reviews`, { cache: "no-store" });
  const data = await res.json();
  const reviews: Review[] = data.success ? data.data : [];

  // Pagination
  const pageSize = 10;
  const page = Number(searchParams?.page) > 0 ? Number(searchParams.page) : 1;
  const totalPages = Math.ceil(reviews.length / pageSize);
  const pagedReviews = reviews.slice((page - 1) * pageSize, page * pageSize);

  // Rendu principal : liste paginée de tous les avis
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Tous les avis ({reviews.length})
      </h1>
      {/* Affichage si aucun avis */}
      {reviews.length === 0 ? (
        <div className="text-gray-500">Aucun avis pour le moment.</div>
      ) : (
        <>
          {/* Liste des avis paginés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-md border p-6 flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-[#e31837]">
                    {review.menuItem?.name || "Plat inconnu"}
                  </h3>
                  <span className="text-yellow-500 text-xl">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <div className="mb-2 text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <div className="flex-1 mb-2">
                  <p className="text-gray-700 text-base">{review.comment}</p>
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">
                  Par :{" "}
                  {review.user?.name && review.user.name.trim()
                    ? review.user.name
                    : "Client anonyme"}
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Link
                href={`?page=${page - 1}`}
                className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300${
                  page === 1 ? " opacity-50 pointer-events-none" : ""
                }`}
                aria-disabled={page === 1}
              >
                Précédent
              </Link>
              <span className="px-2 text-gray-600">
                Page {page} / {totalPages}
              </span>
              <Link
                href={`?page=${page + 1}`}
                className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300${
                  page === totalPages ? " opacity-50 pointer-events-none" : ""
                }`}
                aria-disabled={page === totalPages}
              >
                Suivant
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
