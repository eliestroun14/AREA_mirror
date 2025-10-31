import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { PrismaClientKnownRequestErrorFilter } from '@filters/prisma-client-exception/prisma-client-exception.filter';
import { FormatedValidationPipe } from '@pipes/validation-pipe/formated-validation-pipe-error';
import cookieParser from 'cookie-parser';
import { RunnerModule } from '@root/runner/runner.module';
import { RunnerService } from '@root/runner/runner.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function main() {
  const runnerApp = await NestFactory.create(RunnerModule);
  runnerApp.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost',
      'https://manech.va.sauver.le.monde.area.projects.epitech.bzh',
    ],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });
  app.useGlobalPipes(
    new FormatedValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());
  app.use(cookieParser());

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('AREA API')
    .setDescription("Documentation de l'API AREA - Action Reaction")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  let isRunning = true;
  const runnerService = runnerApp.get(RunnerService);

  const startAreaRunner = async () => {
    console.log('Running runner');
    while (isRunning) {
      await runnerService.start();
    }
  };

  startAreaRunner()
    .then(() => console.log('Stopping runner...'))
    .catch((err) => console.error('An error occurred: ', err));
  await app.listen(process.env.PORT ?? 3000);
  isRunning = false;
}
void main();
