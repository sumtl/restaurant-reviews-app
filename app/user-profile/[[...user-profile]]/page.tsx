"use client";

import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Modifier mon profil
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            Après modification, cliquez sur{" "}
            <span className="font-semibold">Mon profil</span> dans la barre de
            navigation pour revenir à votre profil.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos informations personnelles
          </p>
        </div>
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-lg",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}