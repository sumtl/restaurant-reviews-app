import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { reviewSchema } from "@/lib/rating";
import { ZodError } from "zod";

// GET /api/reviews pour obtenir tous les avis
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtenir tous les avis
 *     description: Récupérer la liste de tous les avis
 *     tags:
 *       - Reviews
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
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                         email:
 *                           type: string
 *                           example: "user1@google.com"
 *                         name:
 *                           type: string
 *                           example: "Donald Trump"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-01-01T00:00:00Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-01-01T00:00:00Z"
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
 *                     email: "user1@google.com"
 *                     name: "Donald Trump"
 *                     createdAt: "2023-01-01T00:00:00Z"
 *                     updatedAt: "2023-01-01T00:00:00Z"
 *                   menuItem:
 *                     id: 1
 *                     name: "Pizza"
 *                     description: "Delicious cheese pizza"
 *                     imageUrl: "https://example.com/pizza.jpg"
 *                     createdAt: "2023-01-01T00:00:00Z"
 *                 - id: 2
 *                   comment: "Bon mais un peu salé"
 *                   rating: 4
 *                   createdAt: "2023-01-02T00:00:00Z"
 *                   updatedAt: "2023-01-02T00:00:00Z"
 *                   user:
 *                     id: "clv1k2z8d0009u3l5g7x9h2wr"
 *                     email: "user2@google.com"
 *                     name: "John Biden"
 *                     createdAt: "2023-01-02T00:00:00Z"
 *                     updatedAt: "2023-01-02T00:00:00Z"
 *                   menuItem:
 *                     id: 2
 *                     name: "Burger"
 *                     description: "Juicy beef burger"
 *                     imageUrl: "https://example.com/burger.jpg"
 *                     createdAt: "2023-01-02T00:00:00Z"
 *               message: "2 avis trouvés"
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
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: reviews,
        message: `${reviews.length} avis trouvé(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

// POST /api/reviews pour créer un nouvel avis
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer un nouvel avis
 *     description: Ajouter un nouvel avis pour un menu item
 *     tags:
 *       - Reviews
 *     parameters:
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
 *               - menuItemId
 *               - rating
 *               - comment
 *             properties:
 *               menuItemId:
 *                 type: integer
 *                 description: ID du menu item
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 description: Note de l'avis (entre 1 et 5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Commentaire de l'avis
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Excellent plat !"
 *     responses:
 *       201:
 *         description: Avis créé avec succès
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
 *                       example: 4
 *                     comment:
 *                       type: string
 *                       example: "Excellent plat !"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-03T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-03T00:00:00Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                         name:
 *                           type: string
 *                           example: "Jean Dupont"
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
 *                   example: "Avis créé avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: 4
 *                 comment: "Excellent plat !"
 *                 rating: 5
 *                 createdAt: "2023-01-03T00:00:00Z"
 *                 updatedAt: "2023-01-03T00:00:00Z"
 *                 user:
 *                   id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                   name: "Donald Trump"
 *                 menuItem:
 *                   id: 1
 *                   name: "Pizza"
 *               message: "Avis créé avec succès"
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
 *                   example: "Données invalides - Rating doit être entre 1 et 5"
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
 *               email_manquant:
 *                 summary: Email utilisateur requis
 *                 value:
 *                   success: false
 *                   error: "Email utilisateur requis"
 *               utilisateur_non_trouve:
 *                 summary: Utilisateur non trouvé
 *                 value:
 *                   success: false
 *                   error: "Utilisateur non trouvé"
 *               donnees_manquantes:
 *                 summary: Données manquantes
 *                 value:
 *                   success: false
 *                   error: "Données manquantes"
 *               deja_review:
 *                 summary: Déjà commenté ce plat
 *                 value:
 *                   success: false
 *                   error: "Vous avez déjà laissé un avis pour ce plat. Veuillez modifier votre avis existant."
 *               rating_invalide:
 *                 summary: Rating invalide
 *                 value:
 *                   success: false
 *                   error: "Données invalides - Rating doit être entre 1 et 5"
 *                   details:
 *                     - path: "rating"
 *                       message: "Rating doit être entre 1 et 5"
 *       500:
 *         description: Erreur lors de la création de l'avis
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
 *                   example: "Erreur lors de la création de l'avis"
 *             example:
 *               success: false
 *               error: "Erreur lors de la création de l'avis"
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification des données
    const body = await request.json();
    const { userId, menuItemId, rating, comment } = body;
    const userEmail = request.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Email utilisateur requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 400 }
      );
    }

    if (!menuItemId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: "Données manquantes",
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce menu item
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        menuItemId,
      },
    });
    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vous avez déjà laissé un avis pour ce plat. Veuillez modifier votre avis existant.",
        },
        { status: 400 }
      );
    }

    // Validation avec Zod
    try {
      reviewSchema.parse({
        userId: user.id,
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

    // créer un nouvel avis
    const userConnect = userId
      ? { connect: { id: userId } }
      : { connect: { email: userEmail as string } };

    const newReview = await prisma.review.create({
      data: {
        user: userConnect,
        menuItem: { connect: { id: menuItemId } },
        rating,
        comment,
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
    });

    return NextResponse.json(
      {
        success: true,
        data: newReview,
        message: "Avis créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
