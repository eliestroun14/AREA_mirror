import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnauthenticatedException extends HttpException {
  constructor() {
    super('You are not authenticated.', HttpStatus.FORBIDDEN);
  }
}
