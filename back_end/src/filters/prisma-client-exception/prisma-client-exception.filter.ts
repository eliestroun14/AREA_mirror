import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const code = exception.code;

    switch (code) {
      case 'P2002': {
        const field = (exception.meta?.target as string[]).pop();
        throw new ConflictException(`This ${field} already exists.`);
      }
      case 'P3001': {
        console.error(exception);
        throw new NotFoundException('Data not found.');
      }
      default: {
        console.error(exception);
        throw new InternalServerErrorException('An internal error occurred.');
      }
    }
  }
}
