import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table zaps
  await prisma.zaps.createMany({
    data: [
      {
        user_id: 1, // adapte l'id selon tes users
        name: 'Welcome Zap',
        description: 'Zap triggered on user signup',
        total_runs: 0,
        successful_runs: 0,
        failed_runs: 0,
      },
      {
        user_id: 2,
        name: 'Music Zap',
        description: 'Zap triggered on playlist creation',
        total_runs: 0,
        successful_runs: 0,
        failed_runs: 0,
      },
    ],
    skipDuplicates: true,
  });
  console.log('Zaps seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
