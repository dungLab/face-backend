import { ApiDocs } from '@/auth/auth.docs';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthService } from '@/auth/services/auth.service';
import { User } from '@/auth/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDocs.kakaoLogin('카카오 oauth2.0 callback(redirect uri)')
  @Get('kakao/callback')
  kakaoLogin(@Query('code') code: string) {
    return this.authService.kakaoLogin(code);
  }

  @ApiDocs.refreshToken('refreshToken으로 accessToken 재발급')
  @Post('refresh-token')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  refreshToken(@User() user: UserEntity) {
    return this.authService.refreshToken(user);
  }
}
