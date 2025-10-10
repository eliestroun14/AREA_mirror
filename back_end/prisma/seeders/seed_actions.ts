import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table actions
  await prisma.actions.createMany({
    data: [
      {
        service_id: 1, // adapte l'id selon tes services
        http_request_id: 1, // adapte l'id selon tes http_requests
        name: 'Send Email',
        description: 'Send an email to a user',
        class_name: 'SendEmailAction',
        fields: {},
        variables: {},
      },
      {
        service_id: 2,
        http_request_id: 2,
        name: 'Create Playlist',
        description: 'Create a new playlist',
        class_name: 'CreatePlaylistAction',
        fields: {},
        variables: {},
      },
    ],
    skipDuplicates: true,
  });
  console.log('Actions seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
