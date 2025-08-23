import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/by-menu/[menuItemId] pour obtenir les avis d'un menu item
/**
 * @swagger
 * /api/reviews/by-menu/{menuItemId}:
 *   get:
 *     summary: Obtenir les avis d'un menu item
 *     description: Récupérer la liste des avis pour un menu item spécifique
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         description: L'ID du menu item
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des avis récupérée avec succès
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       comment:
 *                         type: string
 *                         example: "Très bon plat !"
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                           email:
 *                             type: string
 *                             example: "user1@google.com"
 *                           name:
 *                             type: string
 *                             example: "Donald Trump"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00Z"
 *                       menuItem:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Pizza"
 *                           description:
 *                             type: string
 *                             example: "Delicious cheese pizza"
 *                           imageUrl:
 *                             type: string
 *                             example: "https://example.com/pizza.jpg"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "1 avis trouvé"
 *           example:
 *             success: true
 *             data:
 *               - id: 1
 *                 comment: "Très bon plat !"
 *                 rating: 5
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *                 user:
 *                   id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                   email: "user1@google.com"
 *                   name: "Donald Trump"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                   updatedAt: "2023-01-01T00:00:00Z"
 *                 menuItem:
 *                   id: 1
 *                   name: "Pizza"
 *                   description: "Delicious cheese pizza"
 *                   imageUrl: "https://example.com/pizza.jpg"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *               - id: 2
 *                 comment: "Bon mais un peu salé"
 *                 rating: 4
 *                 createdAt: "2023-01-02T00:00:00Z"
 *                 updatedAt: "2023-01-02T00:00:00Z"
 *                 user:
 *                   id: "clv1k2z8d0009u3l5g7x9h2wr"
 *                   email: "user2@google.com"
 *                   name: "John Biden"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *                   updatedAt: "2023-01-02T00:00:00Z"
 *                 menuItem:
 *                   id: 2
 *                   name: "Burger"
 *                   description: "Juicy beef burger"
 *                   imageUrl: "https://example.com/burger.jpg"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *             message: "2 avis trouvés"
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
 *             example:
 *               success: false
 *               error: "Menu item non trouvé"
 *       500:
 *         description: Erreur lors de la récupération des avis
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
 *                   example: "Erreur lors de la récupération des avis"
 *           example:
 *             success: false
 *             error: "Erreur lors de la récupération des avis"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { menuItemId: string } }
) {
  try {
    const { menuItemId } = params;

    // Vérifier si le menu item existe
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: Number(menuItemId) },
    });
    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu item non trouvé",
        },
        { status: 404 }
      );
    }

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
    return NextResponse.json(
      {
        success: true,
        data: reviews,
        message: `${reviews.length} avis trouvés`,
      },
      { status: 200 }
    );
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
