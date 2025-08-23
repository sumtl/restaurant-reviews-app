import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users pour obtenir tous les utilisateurs

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtenir tous les utilisateurs
 *     description: Récupérer la liste de tous les utilisateurs
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
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
 *                         type: string
 *                         example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                       email:
 *                         type: string
 *                         example: "user1@google.com"
 *                       name:
 *                         type: string
 *                         example: "Donald Trump"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       reviewsCount:
 *                         type: integer
 *                         example: 5
 *                 message:
 *                   type: string
 *                   example: "2 utilisateur(s) trouvé(s)"
 *             example:
 *               success: true
 *               data:
 *                 - id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                   email: "user1@google.com"
 *                   name: "Donald Trump"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                   reviewsCount: 5
 *                 - id: "clv1k2z8d0009u3l5g7x9h2wr"
 *                   email: "user2@google.ca"
 *                   name: "Joe Biden"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *                   reviewsCount: 3
 *               message: "2 utilisateur(s) trouvé(s)"
 *       500:
 *         description: Erreur lors de la récupération des utilisateurs
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
 *                   example: "Erreur lors de la récupération des utilisateurs"
 *             example:
 *               success: false
 *               error: "Erreur lors de la récupération des utilisateurs"
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
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
        data: users,
        message: `${users.length} utilisateur(s) trouvé(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des utilisateurs",
      },
      { status: 500 }
    );
  }
}
