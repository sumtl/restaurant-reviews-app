import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Menu Items & Reviews API",
      description: "API pour la gestion des plats et des avis",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Serveur de production"
            : "Serveur de développement",
      },
    ],
    components: {
      schemas: {
        MenuItem: {
          type: "object",
          required: ["id", "name", "createdAt"],
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique du plat",
              example: 1,
            },
            name: {
              type: "string",
              description: "Nom du plat",
              example: "Pizza Margherita",
            },
            description: {
              type: "string",
              description: "Description du plat",
              example: "Pizza classique avec sauce tomate et mozzarella",
              nullable: true,
            },
            imageUrl: {
              type: "string",
              format: "uri",
              description: "URL de l'image du plat",
              example: "https://exemple.com/pizza.jpg",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        User: {
          type: "object",
          required: ["id", "email", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              description: "Identifiant unique de l'utilisateur",
              example: "clv1k2z8d0000u3l5g7x9h2wq",
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Jean Dupont",
              maxLength: 50,
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification",
              example: "2024-01-15T11:45:00.000Z",
            },
          },
        },
        Review: {
          type: "object",
          required: [
            "id",
            "comment",
            "rating",
            "userId",
            "menuItemId",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique de l'avis",
              example: 1,
            },
            comment: {
              type: "string",
              description: "Commentaire de l'utilisateur",
              example: "Délicieux !",
            },
            rating: {
              type: "integer",
              description: "Note de l'utilisateur (1 à 5)",
              example: 5,
            },
            userId: {
              type: "string",
              description: "ID de l'utilisateur",
              example: "clv1k2z8d0000u3l5g7x9h2wq",
            },
            menuItemId: {
              type: "integer",
              description: "ID du plat",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification",
              example: "2024-01-15T11:45:00.000Z",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object", description: "Données de la réponse" },
            message: {
              type: "string",
              description: "Message descriptif",
              example: "Opération réussie",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "string",
              description: "Message d'erreur",
              example: "Une erreur est survenue",
            },
          },
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);