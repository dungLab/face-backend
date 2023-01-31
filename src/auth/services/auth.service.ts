import {
  OAuthServiceType,
  OAUTH_SERVICES_INJECT_TOKEN,
} from '@/auth/constants';
import { AbstractOAuthService } from '@/auth/services/abstract-oauth-service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(OAUTH_SERVICES_INJECT_TOKEN)
    private readonly oAuthServices: Array<AbstractOAuthService>,
  ) {}

  async kakaoLogin(code: string) {
    return this.oAuthServices
      .find((_d) => _d.getIdentificationKey() === OAuthServiceType.KAKAO)
      .login(code);
  }
}
