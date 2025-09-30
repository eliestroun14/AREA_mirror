import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table connections
  await prisma.connections.createMany({
    data: [
      {
        user_id: 1, // adapte l'id selon tes users
        service_id: 1, // adapte l'id selon tes services
        access_token: 'token1',
      },
      {
        user_id: 2,
        service_id: 2,
        access_token: 'token2',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Connections seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
