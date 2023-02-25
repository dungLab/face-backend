import { ApiDocs } from '@/main/auth/auth.docs';
import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { AuthService } from '@/main/auth/services/auth.service';
import { User } from '@/main/auth/user.decorator';
import { UserEntity } from '@/main/user/entities/user.entity';
import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard)
  refreshToken(@User() user: UserEntity, @Res() res: Response) {
    const accessToken = this.authService.refreshToken(user);
    res.cookie('dunglab-accessToken', accessToken);

    return accessToken;
  }
}
