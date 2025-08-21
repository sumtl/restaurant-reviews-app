import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/[id] pour obtenir un avis par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const reviewID = Number(id);

    // Chercher l'avis par ID
    const review = await prisma.review.findUnique({
      where: { id: reviewID },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: "Avis non trouvé",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: "Avis récupéré avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de l'avis:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de l'avis",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] pour supprimer un avis par son ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const reviewID = Number(id);
    const userEmail = request.headers.get("X-User-Email");

    // Vérifier si l'avis existe
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewID },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "Avis non trouvé",
        },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est l'auteur de l'avis
    if (existingReview.user.email !== userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Vous n'êtes pas autorisé à supprimer cet avis",
        },
        { status: 403 }
      );
    }

    // Supprimer l'avis
    await prisma.review.delete({
      where: { id: reviewID },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Avis supprimé avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'avis",
      },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] pour modifier un avis par son ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const reviewID = Number(id);
    const userEmail = request.headers.get("X-User-Email");
    const { rating, comment, menuItemId } = await request.json();

    // Vérification des données
    if (!rating || !comment || !menuItemId) {
      return NextResponse.json(
        {
          success: false,
          error: "Tous les champs sont requis",
        },
        { status: 400 }
      );
    }

    // Vérifier si l'avis existe
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewID },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "Avis non trouvé",
        },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est l'auteur de l'avis
    if (existingReview.user.email !== userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Vous n'êtes pas autorisé à modifier cet avis",
        },
        { status: 403 }
      );
    }

    // Mettre à jour l'avis
    const updatedReview = await prisma.review.update({
      where: { id: reviewID },
      data: {
        rating,
        comment,
        menuItem: { connect: { id: menuItemId } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedReview,
        message: "Avis modifié avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la modification de l'avis:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la modification de l'avis",
      },
      { status: 500 }
    );
  }
}
