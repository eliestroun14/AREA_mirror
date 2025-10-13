import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table services
  await prisma.http_requests.createMany({
    data: [
      {
        description: 'Get user info',
        method: 'GET',
        endpoint: '/user/info',
      },
      {
        description: 'Update user',
        method: 'POST',
        endpoint: '/user/update',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Http Requests seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
