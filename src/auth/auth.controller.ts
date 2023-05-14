import { ApiDocs } from '@/auth/auth.docs';
import { RefreshTokenDto } from '@/auth/dtos/request/refresh-token.dto';
import { AuthService } from '@/auth/services/auth.service';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('face > 인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiDocs.kakaoLogin('카카오 로그인')
  @Get('kakao-login')
  kakaoLogin(@Res() res: Response) {
    const redirectUrl = `${this.configService.get<string>(
      'kakao.authorize.url',
    )}?client_id=${this.configService.get<string>(
      'kakao.client-id',
    )}&redirect_uri=${this.configService.get<string>(
      'kakao.redirect-uri',
    )}&response_type=code`;

    res.redirect(301, redirectUrl);
  }

  @ApiDocs.kakaoCallback('카카오 oauth2.0 callback(redirect uri)')
  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin(
      code,
    );

    const redirectUrl = this.configService.get<string>('front.redirect-uri');

    res.redirect(
      301,
      `${redirectUrl}?access-token=${accessToken}&refresh-token=${refreshToken}`,
    );
  }

  @ApiDocs.refreshToken('refreshToken으로 accessToken 재발급')
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
