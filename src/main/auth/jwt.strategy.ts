import { JwtPayload } from '@/main/auth/types';
import { ErrorResponse } from '@/common/error-response.exception';
import { UserService } from '@/main/user/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'face-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const foundUserEntity = await this.userService.findById(payload.id);

    if (!foundUserEntity) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, {
        message: '로그인 필요',
        code: -1,
      });
    }

    return foundUserEntity;
  }
}
