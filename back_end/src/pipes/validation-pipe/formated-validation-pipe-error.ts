import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export class FormatedValidationPipe extends ValidationPipe {
  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return validationErrors.map((error) =>
      Object.values(error.constraints || {}).join(', '),
    );
  }

  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const messages = this.flattenValidationErrors(validationErrors);
      throw new BadRequestException(messages.join(', '));
    };
  }
}
