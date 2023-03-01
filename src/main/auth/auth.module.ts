import { Module } from '@nestjs/common';
import { OAUTH_SERVICES_INJECT_TOKEN } from './constants';
import { KakaoOAuthService } from './services/kakao-oauth.service';
import { AuthController } from './auth.controller';
import { NaverOAuthService } from './services/naver-oauth.service';
import { UserModule } from '@/main/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from '@/main/auth/jwt.strategy';
import { AuthService } from '@/main/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('jwt.secretKey'),
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
