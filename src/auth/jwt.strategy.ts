import { JwtPayload } from '@/auth/types';
import { ErrorResponse } from '@/common/error-response.exception';
import { UserService } from '@/user/user.service';
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
    const foundUserEntity = await this.userService.findByEmail(payload.email);

    if (!foundUserEntity) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, {
        message: '로그인 필요',
        //TODO: 에러코드 정의 필요
      });
    }

    return foundUserEntity;
  }
}
