import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table zap_steps
  await prisma.zap_steps.createMany({
    data: [
      {
        zap_id: 1, // adapte l'id selon tes zaps
        step_type: 'trigger',
        step_order: 1,
        payload: {},
      },
      {
        zap_id: 2,
        step_type: 'action',
        step_order: 1,
        payload: {},
      },
    ],
    skipDuplicates: true,
  });
  console.log('Zap Steps seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
