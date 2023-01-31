import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorResponse extends HttpException {
  constructor(
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    options: { message: string; code: number },
  ) {
    super({ message: options?.message, code: options?.code }, code || 500);
  }
}
