import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table services
  await prisma.http_request.createMany({
    data: [
      {
        description: 'Get user info',
        method: 'GET',
        endpoint: '/user/info',
        body_schema: {},
        header_schema: {},
      },
      {
        description: 'Update user',
        method: 'POST',
        endpoint: '/user/update',
        body_schema: {},
        header_schema: {},
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
