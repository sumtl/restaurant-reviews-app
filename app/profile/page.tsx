"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Review, User } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";

// Page de profil utilisateur
export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }
    async function load() {
      try {
        // Charger les infos utilisateur (backend détecte l'utilisateur via Clerk)
        const userResponse = await fetch("/api/users/profile");
        const userData = await userResponse.json();
        if (userData.success) {
          setUserData(userData.data);
        }
        // Charger les avis de l'utilisateur
        const reviewsResponse = await fetch("/api/reviews/by-user");
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setUserReviews(reviewsData.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isLoaded, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500">Chargement du profil...</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <Card className="max-w-xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Impossible de charger le profil utilisateur.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Infos utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérer vos informations personnelles et vos avis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Label>Email :</Label>
            <span className="block text-gray-700">{userData.email}</span>
            <Label>Nom :</Label>
            <span className="block text-gray-700">
              {userData.name || "Non défini"}
            </span>
            <Label>Membre depuis :</Label>
            <span className="block text-gray-700">
              {new Date(userData.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <Button asChild variant="default">
              <Link href="/user-profile">Modifier</Link>
            </Button>
            <UserButton />
          </div>
        </CardContent>
      </Card>

      {/* Statistiques utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Mes statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>{userReviews.length}</strong> avis publiés
          </p>
          {userReviews.length > 0 && (
            <p>
              Note moyenne donnée :{" "}
              <strong>
                {(
                  userReviews.reduce((sum, review) => sum + review.rating, 0) /
                  userReviews.length
                ).toFixed(1)}
                /5
              </strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Liste des avis de l'utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Mes avis</CardTitle>
        </CardHeader>
        <CardContent>
          {userReviews.length === 0 ? (
            <div className="text-center py-8">
              <p>Vous n'avez pas encore publié d'avis.</p>
              <Button asChild variant="link">
                <Link href="/">
                  Parcourez le menu pour laisser votre premier avis !
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <Card key={review.id} className="bg-gray-50">
                  <CardHeader>
                    <CardTitle>
                      <Link
                        href={`/menu-items/${review.menuItem.id}`}
                        className="text-orange-600 hover:underline"
                      >
                        {review.menuItem.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg">
                        {"⭐".repeat(review.rating)}
                      </div>
                      <small className="text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </small>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
