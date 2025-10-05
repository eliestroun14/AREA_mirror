import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { PrismaClientKnownRequestErrorFilter } from '@filters/prisma-client-exception/prisma-client-exception.filter';
import { FormatedValidationPipe } from '@pipes/validation-pipe/formated-validation-pipe-error';
import cookieParser from 'cookie-parser';
import { WorkflowsModule } from '@root/workflows/workflows.module';
import { WorkflowService } from '@root/workflows/workflows.service';

async function runWorkflow() {}

async function main() {
  const workflowApp = await NestFactory.create(WorkflowsModule);
  workflowApp.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());

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

  let isRunning = true;
  const workflowService = workflowApp.get(WorkflowService);

  const runWorkflow = async () => {
    console.log('Running workflows');
    while (isRunning) {
      await workflowService.run();
    }
  };

  runWorkflow()
    .then(() => console.log('Stopping workflows...'))
    .catch((err) => console.error('An error occurred: ', err));
  await app.listen(process.env.PORT ?? 3000);
  isRunning = false;
}
void main();
