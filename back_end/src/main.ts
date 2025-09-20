import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { PrismaClientKnownRequestErrorFilter } from '@filters/prisma-client-exception/prisma-client-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void main();
