import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/by-user pour obtenir les avis d'un utilisateur
/**
 * @swagger
 * /api/reviews/by-user:
 *   get:
 *     summary: Obtenir les avis d'un utilisateur
 *     description: Récupérer la liste des avis pour un utilisateur spécifique (via le header X-User-Email)
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: header
 *         name: X-User-Email
 *         required: true
 *         description: Email de l'utilisateur pour filtrer les avis
 *         schema:
 *           type: string
 *           format: email
 *           example: "user1@google.com"
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
 *                           name:
 *                             type: string
 *                             example: "Donald Trump"
 *                       menuItem:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Pizza"
 *                 message:
 *                   type: string
 *                   example: "2 avis trouvés pour cet utilisateur"
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   comment: "Très bon plat !"
 *                   rating: 5
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                   updatedAt: "2023-01-01T00:00:00Z"
 *                   user:
 *                     id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                     name: "Donald Trump"
 *                   menuItem:
 *                     id: 1
 *                     name: "Pizza"
 *                 - id: 2
 *                   comment: "Bon mais un peu salé"
 *                   rating: 4
 *                   createdAt: "2023-01-02T00:00:00Z"
 *                   updatedAt: "2023-01-02T00:00:00Z"
 *                   user:
 *                     id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                     name: "Donald Trump"
 *                   menuItem:
 *                     id: 2
 *                     name: "Burger"
 *               message: "2 avis trouvés pour cet utilisateur"
 *       401:
 *         description: Header X-User-Email manquant
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
 *                   example: "Email utilisateur requis"
 *             example:
 *               success: false
 *               error: "Email utilisateur requis"
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
 *             example:
 *               success: false
 *               error: "Erreur lors de la récupération des avis"
 */
export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("X-User-Email");
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Email utilisateur requis" },
        { status: 401 }
      );
    }
    const reviews = await prisma.review.findMany({
      where: {
        user: {
          email: userEmail,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: reviews,
        message: `${reviews.length} avis trouvés pour cet utilisateur`,
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
