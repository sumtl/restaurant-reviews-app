import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items pour obtenir tous les menu items
/**
 * @swagger
 * /api/menu-items:
 *   get:
 *     summary: Obtenir tous les menu items
 *     description: Récupérer la liste de tous les menu items
 *     tags:
 *       - Menu Items
 *     responses:
 *       200:
 *         description: Liste des menu items récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *                 message:
 *                   type: string
 *                   example: Liste des menu items récupérée avec succès
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: "Pizza"
 *                   description: "Delicious cheese pizza"
 *                   imageUrl: "https://example.com/pizza.jpg"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                 - id: 2
 *                   name: "Burger"
 *                   description: "Juicy beef burger"
 *                   imageUrl: "https://example.com/burger.jpg"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *               message: "2 menu item(s) trouvé(s)"
 *       500:
 *         description: Erreur lors de la récupération des menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erreur lors de la récupération des menu items
 */
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: menuItems,
        message: `${menuItems.length} menu item(s) trouvé(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des menu items:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
