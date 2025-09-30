import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table users
  await prisma.users.createMany({
    data: [
      {
        email: 'user1@example.com',
        name: 'User One',
        password: 'password1',
      },
      {
        email: 'user2@example.com',
        name: 'User Two',
        password: 'password2',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Users seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
