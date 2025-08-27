import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login pour connecter un utilisateur (ou le créer s'il n'existe pas)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur avec un email
 *     description: Connecter un utilisateur (ou le créer s'il n'existe pas)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@google.com
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
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
 *                       example: clv1k2z8d0000u3l5g7x9h2wq
 *                     email:
 *                       type: string
 *                       example: user@google.com
 *                     name:
 *                       type: string
 *                       example: Donald Trump
 *                     isNewUser:
 *                       type: boolean
 *                       example: false
 *                 message:
 *                   type: string
 *                   example: Utilisateur connecté avec succès
 *       201:
 *         description: Nouvel utilisateur créé et connecté avec succès
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
 *                       example: clv1k2z8d0000u3l5g7x9h2wq
 *                     email:
 *                       type: string
 *                       example: user@google.com
 *                     name:
 *                       type: string
 *                       example: Donald Trump
 *                     isNewUser:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: Nouvel utilisateur créé et connecté avec succès
 *       400:
 *         description: Email manquant
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
 *                   example: Email est obligatoire
 *       500:
 *         description: Erreur lors de la connexion (par exemple, problème de base de données)
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
 *                   example: Erreur lors de la connexion
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email est obligatoire",
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Si l'utilisateur n'existe pas, le créer automatiquement
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: null, // Nom sera défini plus tard via le profil
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            isNewUser: true,
          },
          message: "Nouvel utilisateur créé et connecté avec succès",
        },
        { status: 201 }
      );
    }

    // Utilisateur existant
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isNewUser: false,
        },
        message: "Utilisateur connecté avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la connexion",
      },
      { status: 500 }
    );
  }
}
