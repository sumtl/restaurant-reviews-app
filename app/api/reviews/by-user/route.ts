import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/by-user pour obtenir les avis d'un utilisateur
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
        return NextResponse.json({
            success: true,
            data: reviews,
            message: `${reviews.length} avis trouvés pour cet utilisateur`,
        });
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