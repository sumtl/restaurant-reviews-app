import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items/[id] pour obtenir un menu item par ID
/**
 * @swagger
 * /api/menu-items/{id}:
 *  get:
 *     summary: Obtenir un menu item par ID
 *     description: Récupérer un menu item spécifique en utilisant son ID
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Menu item récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *                 message:
 *                   type: string
 *                   example: "Menu item récupéré avec succès"
 *           example:
 *             success: true
 *             data:
 *               id: 1
 *               name: "Pizza"
 *               description: "Delicious cheese pizza"
 *               imageUrl: "https://example.com/pizza.jpg"
 *               createdAt: "2023-01-01T00:00:00Z"
 *             message: "Menu item récupéré avec succès"
 *       404:
 *         description: Menu item non trouvé
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
 *                   example: "Menu item non trouvé"
 *           example:
 *             success: false
 *             error: "Menu item non trouvé"
 *       500:
 *         description: Erreur lors de la récupération du menu item
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
 *                   example: "Erreur lors de la récupération du menu item"
 *           example:
 *             success: false
 *             error: "Erreur lors de la récupération du menu item"
 */
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
