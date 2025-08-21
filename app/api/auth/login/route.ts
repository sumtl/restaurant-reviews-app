import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login pour connecter un utilisateur (ou le créer s'il n'existe pas)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email est obligatoire",
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Si l'utilisateur n'existe pas, le créer automatiquement
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: null, // Nom sera défini plus tard via le profil
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            isNewUser: true,
          },
          message: "Nouvel utilisateur créé et connecté avec succès",
        },
        { status: 201 }
      );
    }

    // Utilisateur existant
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isNewUser: false,
        },
        message: "Utilisateur connecté avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la connexion",
      },
      { status: 500 }
    );
  }
}
