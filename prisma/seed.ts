import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // await prisma.menuItem.deleteMany();
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "MenuItem" RESTART IDENTITY CASCADE;`
  );
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: "Combo Hot Dog au Bœuf",
        description: "Hot Dog au Bœuf 1/4 livre et Boisson Fontaine 20 oz",
        imageUrl: "/images/costco-food/hot-dog.jpg",
      },
    }),
    
    prisma.menuItem.create({
      data: {
        name: "Pizza au Fromage",
        description: "Pizza au Fromage 18 pouces (6 tranches)",
        imageUrl: "/images/costco-food/cheese-pizza.jpg",
      },
    }),

    prisma.menuItem.create({
      data: {
        name: "Pizza Pepperoni",
        description: "Pizza Pepperoni 18 pouces (6 tranches)",
        imageUrl: "/images/costco-food/pepperoni-pizza.avif",
      },
    }),

    prisma.menuItem.create({
      data: {
        name: "Sandwich",
        description: "Sandwich à la viande fumée style Montréal",
        imageUrl: "/images/costco-food/sandwich.jpg",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Poutine",
        description: "Délicieuse poutine avec fromage en grains et sauce",
        imageUrl: "/images/costco-food/poutine.jpg",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Frites",
        description: "Frites croustillantes",
        imageUrl: "/images/costco-food/fries.jpg",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Lanières de Poulet et Frites",
        description: "Lanières de poulet servies avec des frites",
        imageUrl: "/images/costco-food/chicken-tenders.jpg",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Biscuit",
        description: "Biscuit aux Pépites de Chocolat Double",
        imageUrl: "/images/costco-food/cookie.jpg",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Cornet de Crème Glacée",
        description: "Cornet de Crème Glacée Chocolat ou Vanille",
        imageUrl: "/images/costco-food/icecream.png",
      },
    }),
  ]);

  console.log("Seed data created:", menuItems);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
