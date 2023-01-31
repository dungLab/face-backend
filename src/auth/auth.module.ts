import { Module } from '@nestjs/common';
import { OAUTH_SERVICES_INJECT_TOKEN } from './constants';
import { KakaoOAuthService } from './services/kakao-oauth.service';
import { AuthController } from './auth.controller';
import { NaverOAuthService } from './services/naver-oauth.service';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from '@/auth/jwt.strategy';
import { AuthService } from '@/auth/services/auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: 'face-secret',
          signOptions: {
            expiresIn: '14d',
          },
        };
      },
    }),
    UserModule,
  ],
  providers: [
    JwtAuthStrategy,
    KakaoOAuthService,
    NaverOAuthService,
    AuthService,
    {
      provide: OAUTH_SERVICES_INJECT_TOKEN,
      useFactory: (
        kakaoOAuthService: KakaoOAuthService,
        naverOAuthService: NaverOAuthService,
      ) => [kakaoOAuthService, naverOAuthService],
      inject: [KakaoOAuthService, NaverOAuthService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
