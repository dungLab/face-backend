import { ErrorResponse } from '@/common/error-response.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof TokenExpiredError) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, {
        message: 'expired token',
        code: -1,
      });
    } else if (info instanceof JsonWebTokenError) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, {
        message: 'invalid token',
        code: -1,
      });
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
