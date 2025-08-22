import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { reviewSchema } from "@/lib/rating";
import { ZodError } from "zod";

// GET /api/reviews pour obtenir tous les avis
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        menuItem: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      message: `${reviews.length} avis trouvé(s)`,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

// POST /api/reviews pour créer un nouvel avis
export async function POST(request: NextRequest) {
  try {
    // Vérification des données
    const body = await request.json();
    const { userId, menuItemId, rating, comment } = body;
    const userEmail = request.headers.get("X-User-Email");
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Email utilisateur requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 400 }
      );
    }

    if (!menuItemId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: "Données manquantes",
        },
        { status: 400 }
      );
    }

    // Validation avec Zod
    try {
      reviewSchema.parse({
        userId: user.id,
        menuItemId,
        rating,
        comment,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: "Données invalides - Rating doit être entre 1 et 5",
            details: error.issues,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // créer un nouvel avis
    const userConnect = userId
      ? { connect: { id: userId } }
      : { connect: { email: userEmail as string } };

    const newReview = await prisma.review.create({
      data: {
        user: userConnect,
        menuItem: { connect: { id: menuItemId } },
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        menuItem: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newReview,
        message: "Avis créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
