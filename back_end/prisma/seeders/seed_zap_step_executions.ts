import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table zap_step_executions
  await prisma.zap_step_executions.createMany({
    data: [
      {
        zap_step_id: 1, // adapte l'id selon tes zap_steps
        zap_execution_id: 1, // adapte l'id selon tes zap_executions
        data: {},
        status: 'success',
        duration_ms: 500,
        started_at: new Date(),
        ended_at: new Date(),
      },
      {
        zap_step_id: 2,
        zap_execution_id: 2,
        data: {},
        status: 'failed',
        duration_ms: 800,
        started_at: new Date(),
        ended_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  console.log('Zap Step Executions seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
