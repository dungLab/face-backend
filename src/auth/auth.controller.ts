import { ApiDocs } from '@/auth/auth.docs';
import { AUTH_SERVICES_INJECT_TOKEN, AuthServiceType } from '@/auth/constants';
import { AbstractAuthService } from '@/auth/services/abstract-auth-service';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICES_INJECT_TOKEN)
    private readonly authServices: Array<AbstractAuthService>,
  ) {}

  @ApiDocs.kakaoLogin('카카오 oauth2.0 callback(redirect uri)')
  @Get('kakao')
  kakaoLogin(@Query('code') code: string) {
    return this.authServices
      .find((_d) => _d.getIdentificationKey() === AuthServiceType.KAKAO)
      .login(code);
  }
}
