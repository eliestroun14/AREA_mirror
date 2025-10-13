import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table webhooks
  await prisma.webhooks.createMany({
    data: [
      {
        event: 'event-name-1',
        action: 'action-1',
        from_url: 'https://webhook.site/1',
        secret: 'secret1',
      },
      {
        event: 'event-name-2',
        action: 'action-2',
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
