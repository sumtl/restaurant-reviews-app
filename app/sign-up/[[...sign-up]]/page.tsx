"use client";

import { SignUp ,useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && isSignedIn) {
        router.push("/login/welcome");
      }
    }, [isSignedIn, isLoaded, router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Inscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Creez votre compte</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-lg",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          forceRedirectUrl="/login/welcome" // Rediriger après l'inscription
        />
      </div>
    </div>
  );
}
