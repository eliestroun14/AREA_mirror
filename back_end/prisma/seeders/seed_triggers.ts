import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute ici les données à insérer dans la table triggers
  await prisma.triggers.createMany({
    data: [
      {
        service_id: 1, // adapte l'id selon tes services
        trigger_type: 'http',
        name: 'On User Signup',
        description: 'Triggered when a user signs up',
        class_name: 'OnUserSignupTrigger',
        fields: {},
        variables: {},
      },
      {
        service_id: 2,
        trigger_type: 'webhook',
        name: 'On Payment',
        description: 'Triggered when a payment is made',
        class_name: 'OnPaymentTrigger',
        fields: {},
        variables: {},
      },
    ],
    skipDuplicates: true,
  });
  console.log('Triggers seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
