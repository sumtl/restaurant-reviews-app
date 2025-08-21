import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items/[id] pour obtenir un menu item par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: menuItem,
        message: "Menu item récupéré avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du menu item:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération du menu item" },
      { status: 500 }
    );
  }
}
