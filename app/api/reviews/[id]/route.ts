
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/rating";
import { ZodError } from "zod";

// GET /api/reviews/[id] pour obtenir un avis par son ID
/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Obtenir un avis par ID
 *     description: Récupérer un avis spécifique en utilisant son ID
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'avis
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Avis récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     comment:
 *                       type: string
 *                       example: "Très bon plat !"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                         name:
 *                           type: string
 *                           example: "Donald Trump"
 *                         email:
 *                           type: string
 *                           example: "user1@google.com"
 *                     menuItem:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Pizza"
 *                 message:
 *                   type: string
 *                   example: "Avis récupéré avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 comment: "Très bon plat !"
 *                 rating: 5
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *                 user:
 *                   id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                   name: "Donald Trump"
 *                   email: "user1@google.com"
 *                 menuItem:
 *                   id: 1
 *                   name: "Pizza"
 *               message: "Avis récupéré avec succès"
 *       404:
 *         description: Avis non trouvé
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
 *                   example: "Avis non trouvé"
 *             example:
 *               success: false
 *               error: "Avis non trouvé"
 *       500:
 *         description: Erreur lors de la récupération de l'avis
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
 *                   example: "Erreur lors de la récupération de l'avis"
 *             example:
 *               success: false
 *               error: "Erreur lors de la récupération de l'avis"
 */
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
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis par ID
 *     description: Supprimer un avis spécifique (l'utilisateur doit être l'auteur)
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'avis à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: header
 *         name: X-User-Email
 *         required: true
 *         description: Email de l'utilisateur (doit être l'auteur de l'avis)
 *         schema:
 *           type: string
 *           format: email
 *           example: "user1@google.com"
 *     responses:
 *       200:
 *         description: Avis supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avis supprimé avec succès"
 *             example:
 *               success: true
 *               message: "Avis supprimé avec succès"
 *       403:
 *         description: Non autorisé à supprimer cet avis
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
 *                   example: "Vous n'êtes pas autorisé à supprimer cet avis"
 *             example:
 *               success: false
 *               error: "Vous n'êtes pas autorisé à supprimer cet avis"
 *       404:
 *         description: Avis non trouvé
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
 *                   example: "Avis non trouvé"
 *             example:
 *               success: false
 *               error: "Avis non trouvé"
 *       500:
 *         description: Erreur lors de la suppression de l'avis
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
 *                   example: "Erreur lors de la suppression de l'avis"
 *             example:
 *               success: false
 *               error: "Erreur lors de la suppression de l'avis"
 */
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

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Modifier un avis par ID
 *     description: Modifier un avis spécifique (l'utilisateur doit être l'auteur)
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'avis à modifier
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: header
 *         name: X-User-Email
 *         required: true
 *         description: Email de l'utilisateur (doit être l'auteur de l'avis)
 *         schema:
 *           type: string
 *           format: email
 *           example: "user1@google.com"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *               - menuItemId
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Note de l'avis (entre 1 et 5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Commentaire de l'avis
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Bon mais un peu salé"
 *               menuItemId:
 *                 type: integer
 *                 description: ID du menu item
 *                 example: 2
 *     responses:
 *       200:
 *         description: Avis modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     comment:
 *                       type: string
 *                       example: "Bon mais un peu salé"
 *                     rating:
 *                       type: integer
 *                       example: 4
 *                     menuItemId:
 *                       type: integer
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-03T00:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Avis modifié avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 comment: "Bon mais un peu salé"
 *                 rating: 4
 *                 menuItemId: 2
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-03T00:00:00Z"
 *               message: "Avis modifié avec succès"
 *       400:
 *         description: Données invalides ou manquantes
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
 *                   example: "Tous les champs sont requis"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: "rating"
 *                       message:
 *                         type: string
 *                         example: "Rating doit être entre 1 et 5"
 *             examples:
 *               champs_manquants:
 *                 summary: Champs manquants
 *                 value:
 *                   success: false
 *                   error: "Tous les champs sont requis"
 *               rating_invalide:
 *                 summary: Rating invalide
 *                 value:
 *                   success: false
 *                   error: "Données invalides - Rating doit être entre 1 et 5"
 *                   details:
 *                     - path: "rating"
 *                       message: "Rating doit être entre 1 et 5"
 *       403:
 *         description: Non autorisé à modifier cet avis
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
 *                   example: "Vous n'êtes pas autorisé à modifier cet avis"
 *             example:
 *               success: false
 *               error: "Vous n'êtes pas autorisé à modifier cet avis"
 *       404:
 *         description: Avis non trouvé
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
 *                   example: "Avis non trouvé"
 *             example:
 *               success: false
 *               error: "Avis non trouvé"
 *       500:
 *         description: Erreur lors de la modification de l'avis
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
 *                   example: "Erreur lors de la modification de l'avis"
 *             example:
 *               success: false
 *               error: "Erreur lors de la modification de l'avis"
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const reviewID = Number(id);
    const userEmail = request.headers.get("X-User-Email");
    const { rating, comment, menuItemId } = await request.json();

    // Vérification des données de base
    if (!rating || !comment || !menuItemId) {
      return NextResponse.json(
        {
          success: false,
          error: "Tous les champs sont requis",
        },
        { status: 400 }
      );
    }

    // Validation avec Zod
    try {
      reviewSchema.parse({
        userId: "", // On passe un string vide car on n'a pas besoin de userId pour la validation du rating
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
