import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { PrismaClientKnownRequestErrorFilter } from '@filters/prisma-client-exception/prisma-client-exception.filter';
import { FormatedValidationPipe } from '@pipes/validation-pipe/formated-validation-pipe-error';
import cookieParser from 'cookie-parser';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost',
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new FormatedValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
void main();
