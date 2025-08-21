import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items pour obtenir tous les menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
      message: `${menuItems.length} menu item(s) trouvé(s)`,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des menu items:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
