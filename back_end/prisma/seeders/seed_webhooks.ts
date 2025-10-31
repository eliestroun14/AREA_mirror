import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table webhooks
  await prisma.webhooks.createMany({
    data: [
      {
        secret: 'secret1',
      },
      {
        secret: 'secret2',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Webhooks seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
