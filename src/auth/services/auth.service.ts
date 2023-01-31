import {
  OAuthServiceType,
  OAUTH_SERVICES_INJECT_TOKEN,
} from '@/auth/constants';
import { KakaoUserInfoDto } from '@/auth/dtos/kakao-user-info.dto';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { JwtPayload } from '@/auth/types';
import { ErrorResponse } from '@/common/error-response.exception';
import { UserEntity } from '@/user/entities/user.entity';
import { UserRepository } from '@/user/repositories/user.repository';
import { UserService } from '@/user/user.service';
import { generateRandomNickName } from '@/user/utils';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // services
    @Inject(OAUTH_SERVICES_INJECT_TOKEN)
    private readonly oAuthServices: Array<AbstractOAuthService>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,

    // repositories
    private readonly userRepository: UserRepository,
  ) {}

  async kakaoLogin(code: string): Promise<LoginResponseDto> {
    const kakaoUserInfo = (await this.oAuthServices
      .find((_d) => _d.getIdentificationKey() === OAuthServiceType.KAKAO)
      .login(code)) as KakaoUserInfoDto;

    let user = await this.userService.findByKakaoEmail(kakaoUserInfo.email);

    if (!user) {
      //회원가입
      user = await this.userRepository.save({
        email: kakaoUserInfo.email,
        nickName: generateRandomNickName(),
        type: OAuthServiceType.KAKAO,
      });
    }

    return {
      accessToken: this._generateAccessToken({ ...user }),
      refreshToken: this._generateRefreshToken({ ...user }),
    };
  }

  refreshToken(user: UserEntity) {
    return this._generateAccessToken({ ...user });
  }

  private _generateAccessToken(payload: JwtPayload): string {
    if (!payload) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'there is no payload when generating accessToken',
        code: -1,
      });
    }

    const expiresIn = this.configService.get<string>(
      'jwt.access-token.expires',
    );

    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  private _generateRefreshToken(payload: JwtPayload): string {
    if (!payload) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'there is no payload when generating refreshToken',
        code: -1,
      });
    }

    const expiresIn = this.configService.get<string>(
      'jwt.refresh-token.expires',
    );

    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }
}
