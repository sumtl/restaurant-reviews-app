import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/by-menu/[menuItemId] pour obtenir les avis d'un menu item  
export async function GET(
  request: NextRequest,
  { params }: { params: { menuItemId: string } }
) {
  try {
    const { menuItemId } = params;

    // Chercher tous les avis pour ce menu item
    const reviews = await prisma.review.findMany({
      where: {
        menuItemId: Number(menuItemId),
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
            description: true,
            imageUrl: true,
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
      message: `${reviews.length} avis trouvés`,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des avis",
      },
      { status: 500 }
    );
  }
}
