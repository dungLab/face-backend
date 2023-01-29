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

@Injectable()
export class KakaoAuthService extends AbstractAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async login(code: string): Promise<LoginResponseDto> {
    const clientId = this.configService.get<string>('kakao.client-id');
    const kakaoUrl = this.configService.get<string>('kakao.token.url');
    const clientSercret = this.configService.get<string>('kakao.client-secret');
    const redirectUrl = this.configService.get<string>('redirect-uri');

    const data = qs.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      client_secret: clientSercret,
      redirect_uri: redirectUrl,
    });

    const config = {
      method: 'post',
      url: kakaoUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    const result = await firstValueFrom(
      this.httpService.post(kakaoUrl, data, config).pipe(
        map((res) => res.data),
        catchError((err: AxiosError) => {
          throw new ErrorResponse(HttpStatus.UNAUTHORIZED, {
            message: 'kakao login fail',
            code: 1001,
          });
        }),
      ),
    );

    //TODO:우리 jwt accessToken, refreshToken으로 바꿔서 응답

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
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
}
