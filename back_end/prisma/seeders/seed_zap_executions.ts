import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table zap_executions
  await prisma.zap_executions.createMany({
    data: [
      {
        zap_id: 1, // adapte l'id selon tes zaps
        status: 'success',
        duration_ms: 1000,
        started_at: new Date(),
        ended_at: new Date(),
      },
      {
        zap_id: 2,
        status: 'failed',
        duration_ms: 2000,
        started_at: new Date(),
        ended_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  console.log('Zap Executions seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
