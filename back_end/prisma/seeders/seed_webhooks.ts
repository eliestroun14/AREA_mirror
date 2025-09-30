import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table webhooks
  await prisma.webhooks.createMany({
    data: [
      {
        header_schema: {},
        body_schema: {},
        from_url: 'https://webhook.site/1',
        secret: 'secret1',
      },
      {
        header_schema: {},
        body_schema: {},
        from_url: 'https://webhook.site/2',
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
