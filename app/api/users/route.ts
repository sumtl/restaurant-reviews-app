import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET /api/users pour obtenir tous les utilisateurs

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtenir tous les utilisateurs
 *     description: Récupérer la liste de tous les utilisateurs
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - clerkAuth: []
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
 *       401:
 *         description: Non authentifié (Clerk session requise)
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
 *                   example: "Non autorisé"
 *             example:
 *               success: false
 *               error: "Non autorisé"
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

// POST /api/users pour créer un nouvel utilisateur si n'existe pas
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Créer un nouvel utilisateur s'il n'existe pas déjà (authentification via Clerk)
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - clerkAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
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
 *                       type: string
 *                       example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                     email:
 *                       type: string
 *                       example: "user1@google.com"
 *                     name:
 *                       type: string
 *                       example: "Donald Trump"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Utilisateur trouvé ou créé avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                 email: "user1@google.com"
 *                 name: "Donald Trump"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *               message: "Utilisateur trouvé ou créé avec succès"
 *       201:
 *         description: Nouvel utilisateur créé avec succès
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
 *                       type: string
 *                       example: "clv1k2z8d0000u3l5g7x9h2wq"
 *                     email:
 *                       type: string
 *                       example: "user1@google.com"
 *                     name:
 *                       type: string
 *                       example: "Donald Trump"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Nouvel utilisateur créé et connecté avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                 email: "user1@google.com"
 *                 name: "Donald Trump"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *               message: "Nouvel utilisateur créé et connecté avec succès"
 *       401:
 *         description: Utilisateur non authentifié
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
 *                   example: "Utilisateur non authentifié"
 *             example:
 *               success: false
 *               error: "Utilisateur non authentifié"
 *       400:
 *         description: L'adresse email de l'utilisateur est manquante
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
 *                   example: "L'adresse email de l'utilisateur est manquante"
 *             example:
 *               success: false
 *               error: "L'adresse email de l'utilisateur est manquante"
 *       500:
 *         description: Erreur lors de la création de l'utilisateur
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
 *                   example: "Erreur lors de la création de l'utilisateur"
 *             example:
 *               success: false
 *               error: "Erreur lors de la création de l'utilisateur"
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "Utilisateur non authentifié",
      },
      { status: 401 }
    );
  }
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress ?? "";
    const name = user?.firstName
      ? `${user.firstName} ${user.lastName}`.trim()
      : null;
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "L'adresse email de l'utilisateur est manquante",
        },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          data: existingUser,
          message: "Utilisateur trouvé",
        },
        { status: 200 }
      );
    }
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        name: name,
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "Utilisateur créé",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création de l'utilisateur",
      },
      { status: 500 }
    );
  }
}
