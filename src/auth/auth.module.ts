import { Module } from '@nestjs/common';
import { KakaoOAuthService } from './services/kakao-oauth.service';
import { AuthController } from './auth.controller';
import { NaverOAuthService } from './services/naver-oauth.service';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from '@/auth/jwt.strategy';
import { AuthService } from '@/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { OAUTH_SERVICES_INJECT_TOKEN } from '@/common/constants/inject-token.constant';

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
