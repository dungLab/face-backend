import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as qs from 'qs';
import { OAuthServiceType } from '@/auth/constants';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { ErrorResponse } from '@/common/error-response.exception';
import { KakaoUserInfoDto } from '@/auth/dtos/kakao-user-info.dto';

@Injectable()
export class KakaoOAuthService extends AbstractOAuthService {
  constructor(
    //services
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async login(code: string): Promise<KakaoUserInfoDto> {
    const kakaoAccessToken = await this._getKakaoAccessToken(code);

    const kakaoUserInfo = await this._getKakaoUserInfo(kakaoAccessToken);

    return kakaoUserInfo;
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

  getIdentificationKey(): OAuthServiceType {
    return OAuthServiceType.KAKAO;
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
        message: 'kakao user has no email',
        code: -10004,
      });
    }

    return {
      email: userInfo.kakao_account.email,
    };
  }
}
