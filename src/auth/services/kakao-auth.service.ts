import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as qs from 'qs';
import { AuthServiceType } from '@/auth/constants';
import { AbstractAuthService } from '@/auth/services/abstract-auth-service';
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { ErrorResponse } from '@/common/error-response.exception';
import { KakaoUserInfoDto } from '@/auth/dtos/kakao-user-info.dto';

@Injectable()
export class KakaoAuthService extends AbstractAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async login(code: string): Promise<LoginResponseDto> {
    const accessToken = await this._getKakaoAccessToken(code);

    const kakaoUserInfo = await this._getKakaoUserInfo(accessToken);

    // accessToken: 359.98333분 (5.98시간)
    // refreshToken 86399.98333 (1439.9997221667시간) (59.9999884236124927 일)

    //TODO:우리 jwt accessToken, refreshToken으로 바꿔서 응답

    // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-re-authentication
    // 카카오 로그인되어있어도 다시 로그인시키는 문서

    return {
      accessToken: 'blah blah..',
      refreshToken: 'blah blah..',
    };
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  signUp() {
    throw new Error('Method not implemented.');
  }

  getInfoByToken() {
    throw new Error('Method not implemented.');
  }

  getIdentificationKey(): AuthServiceType {
    return AuthServiceType.KAKAO;
  }

  private async _getKakaoAccessToken(code: string): Promise<string> {
    const loginResult = await firstValueFrom(
      this.httpService
        .post(
          // url
          this.configService.get<string>('kakao.token.url'),
          // data
          qs.stringify({
            grant_type: 'authorization_code',
            client_id: this.configService.get<string>('kakao.client-id'),
            code,
            client_secret: this.configService.get<string>(
              'kakao.client-secret',
            ),
            redirect_uri: this.configService.get<string>('redirect-uri'),
          }),
          // config
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          },
        )
        .pipe(
          map((res) => res.data),
          catchError((err: AxiosError) => {
            throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
              message: err.message,
              code: -10001,
            });
          }),
        ),
    );

    if (!loginResult.access_token) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'kakao user has no access token',
        code: -10002,
      });
    }

    return loginResult.access_token;
  }

  private async _getKakaoUserInfo(
    accessToken: string,
  ): Promise<KakaoUserInfoDto> {
    const userInfo = await firstValueFrom(
      this.httpService
        .get(this.configService.get<string>('kakao.info.url'), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((err: AxiosError) => {
            throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
              message: err.message,
              code: -10003,
            });
          }),
        ),
    );

    if (!userInfo?.kakao_account?.email) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'kakao user has noe email',
        code: -10004,
      });
    }

    return {
      email: userInfo.kakao_account.email,
    };
  }
}
