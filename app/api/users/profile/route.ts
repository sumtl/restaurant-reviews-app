import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/profile pour obtenir le profil d'un utilisateur

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtenir le profil d'un utilisateur
 *     description: Récupérer le profil d'un utilisateur par son email
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: query
 *         name: email
 *         required: false
 *         description: Email de l'utilisateur pour récupérer son profil
 *         schema:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
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
 *                       example: "user1@example.com"
 *                     name:
 *                       type: string
 *                       example: "Donald Trump"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     reviewsCount:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Profil utilisateur récupéré avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                 email: "user1@example.com"
 *                 name: "Donald Trump"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *                 reviewsCount: 5
 *               message: "Profil utilisateur récupéré avec succès"
 *       400:
 *         description: Manque l'email dans les paramètres de requête ou le header X-User-Email
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
 *                   example: "Email est obligatoire"
 *             example:
 *               success: false
 *               error: "Email est obligatoire"
 *       404:
 *         description: Utilisateur non trouvé
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
 *                   example: "Utilisateur non trouvé"
 *             example:
 *               success: false
 *               error: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur lors de la récupération du profil
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
 *                   example: "Erreur lors de la récupération du profil"
 *             example:
 *               success: false
 *               error: "Erreur lors de la récupération du profil"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userEmail = request.headers.get("X-User-Email");
    const targetEmail = email || userEmail;

    if (!targetEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Email est obligatoire",
        },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur dans la base de données par email
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          reviewsCount: user._count.reviews,
        },
        message: "Profil utilisateur récupéré avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération du profil",
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile pour mettre à jour le profil d'un utilisateur
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Mettre à jour le profil d'un utilisateur
 *     description: Mettre à jour le profil d'un utilisateur
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: header
 *         name: X-User-Email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'utilisateur
 *                 example: "Jean Dupont"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
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
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "Nom Nouveau"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-03-15T12:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Profil mis à jour avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: "clv1k2z8d0000u3l5g7x9h2wq"
 *                 email: "user@example.com"
 *                 name: "Nom Nouveau"
 *                 updatedAt: "2023-03-15T12:00:00Z"
 *               message: "Profil mis à jour avec succès"
 *       400:
 *         description: Erreur de validation ou données manquantes
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
 *                   example: "Le nom doit être une chaîne de caractères"
 *             examples:
 *               nom_pas_chaine:
 *                 summary: Nom pas une chaîne de caractères
 *                 value:
 *                   success: false
 *                   error: "Le nom doit être une chaîne de caractères"
 *               nom_trop_long:
 *                 summary: Nom trop long
 *                 value:
 *                   success: false
 *                   error: "Le nom ne peut pas dépasser 50 caractères"
 *       404:
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
 *                   example: "Utilisateur non trouvé"
 *             example:
 *               success: false
 *               error: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur lors de la mise à jour du profil
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
 *                   example: "Erreur lors de la mise à jour du profil"
 *             example:
 *               success: false
 *               error: "Erreur lors de la mise à jour du profil"
 */
export async function PUT(request: NextRequest) {
  try {
    // Utiliser Email pour vérifier si l'utilisateur est connecté
    const userEmail = request.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Le header X-User-Email est obligatoire",
        },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Validation du nom (doit être une chaîne de caractères, max 50 caractères)
    if (name !== null && name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Le nom doit être une chaîne de caractères",
          },
          { status: 400 }
        );
      }

      if (name.length > 50) {
        return NextResponse.json(
          {
            success: false,
            error: "Le nom ne peut pas dépasser 50 caractères",
          },
          { status: 400 }
        );
      }
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
        },
        { status: 404 }
      );
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "Profil mis à jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour du profil",
      },
      { status: 500 }
    );
  }
}
