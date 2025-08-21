import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/profile pour obtenir le profil d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userEmail = request.headers.get("X-User-Email");
    const targetEmail = email || userEmail;

    if (!targetEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Email est obligatoire",
        },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur dans la base de données par email
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          reviewsCount: user._count.reviews,
        },
        message: "Profil utilisateur récupéré avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération du profil",
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile pour mettre à jour le profil d'un utilisateur
export async function PUT(request: NextRequest) {
  try {
    // Utiliser Email pour vérifier si l'utilisateur est connecté
    const userEmail = request.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Le header X-User-Email est obligatoire",
        },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Validation du nom (doit être une chaîne de caractères, max 50 caractères)
    if (name !== null && name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Le nom doit être une chaîne de caractères",
          },
          { status: 400 }
        );
      }

      if (name.length > 50) {
        return NextResponse.json(
          {
            success: false,
            error: "Le nom ne peut pas dépasser 50 caractères",
          },
          { status: 400 }
        );
      }
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
        },
        { status: 404 }
      );
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "Profil mis à jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour du profil",
      },
      { status: 500 }
    );
  }
}
