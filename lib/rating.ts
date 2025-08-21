import { z } from "zod";

export const reviewSchema = z.object({
  userId: z.string(), // cuid
  menuItemId: z.number(), // Int
  rating: z
    .number()
    .min(1, {
      message: "Rating doit être au minimum 1",
    })
    .max(5, {
      message: "Rating doit être au maximum 5",
    }),
  comment: z.string().min(1).max(500, {
    message: "Le commentaire doit contenir entre 1 et 500 caractères",
  }),
});
