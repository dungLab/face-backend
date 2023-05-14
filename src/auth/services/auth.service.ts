import { OAuthServiceType } from '@/auth/constants';
import { KakaoUserInfoDto } from '@/auth/dtos/kakao-user-info.dto';
import { RefreshTokenDto } from '@/auth/dtos/request/refresh-token.dto';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { JwtPayload } from '@/auth/types';
import { OAUTH_SERVICES_INJECT_TOKEN } from '@/common/constants/inject-token.constant';
import { ErrorResponse } from '@/common/error-response.exception';
import { UserService } from '@/user/user.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Builder } from 'builder-pattern';

@Injectable()
export class AuthService {
  constructor(
    // services
    @Inject(OAUTH_SERVICES_INJECT_TOKEN)
    private readonly oAuthServices: Array<AbstractOAuthService>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async kakaoLogin(code: string): Promise<LoginResponseDto> {
    const kakaoUserInfo = (await this.oAuthServices
      .find((_d) => _d.getIdentificationKey() === OAuthServiceType.KAKAO)
      .login(code)) as KakaoUserInfoDto;

    let user = await this.userService.findByKakaoEmail(kakaoUserInfo.email);

    if (!user) {
      //회원가입
      user = await this.userService.createUser(
        kakaoUserInfo.email,
        OAuthServiceType.KAKAO,
      );
    }

    return Builder(LoginResponseDto)
      .accessToken(this._generateAccessToken({ ...user }))
      .refreshToken(this._generateRefreshToken({ ...user }))
      .build();
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const jwtPayload: JwtPayload = this.jwtService.verify(refreshToken);
    const foundUser = await this.userService.findById(jwtPayload.id);
    if (!foundUser) {
      throw new ErrorResponse(HttpStatus.NOT_FOUND, {
        message: 'there is no user',
        code: -1,
      });
    }

    return this._generateAccessToken({ ...foundUser });
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
