import { ApiDocs } from '@/auth/auth.docs';
import { AuthService } from '@/auth/services/auth.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDocs.kakaoLogin('카카오 oauth2.0 callback(redirect uri)')
  @Get('kakao/callback')
  kakaoLogin(@Query('code') code: string) {
    return this.authService.kakaoLogin(code);
  }
}
