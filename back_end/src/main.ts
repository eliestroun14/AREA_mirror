import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { PrismaClientKnownRequestErrorFilter } from '@filters/prisma-client-exception/prisma-client-exception.filter';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
main();
