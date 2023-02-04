import { ApiDocs } from '@/auth/auth.docs';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthService } from '@/auth/services/auth.service';
import { User } from '@/auth/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

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

    res.cookie('dunglab-accessToken', accessToken);
    res.cookie('dunglab-refreshToken', refreshToken);

    const redirectUrl = this.configService.get<string>('front.redirect-uri');

    res.redirect(301, redirectUrl);
  }

  @ApiDocs.refreshToken('refreshToken으로 accessToken 재발급')
  @Post('refresh-token')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  refreshToken(@User() user: UserEntity, @Res() res: Response) {
    const accessToken = this.authService.refreshToken(user);
    res.cookie('dunglab-accessToken', accessToken);

    return accessToken;
  }
}
