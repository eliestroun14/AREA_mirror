import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table services
  await prisma.services.createMany({
    data: [
      {
        name: 'Google',
        slug: 'google',
        icon_url: 'https://example.com/google.png',
        api_base_url: 'https://api.google.com',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.google.com',
      },
      {
        name: 'Spotify',
        slug: 'spotify',
        icon_url: 'https://example.com/spotify.png',
        api_base_url: 'https://api.spotify.com',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.spotify.com',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Services seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
