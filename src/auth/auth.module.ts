import { Module } from '@nestjs/common';
import { AUTH_SERVICES_INJECT_TOKEN } from './constants';
import { KakaoAuthService } from './services/kakao-auth.service';
import { AuthController } from './auth.controller';
import { NaverAuthService } from './services/naver-auth.service';

@Module({
  providers: [
    KakaoAuthService,
    NaverAuthService,
    {
      provide: AUTH_SERVICES_INJECT_TOKEN,
      useFactory: (
        kakaoAuthService: KakaoAuthService,
        naverAuthService: NaverAuthService,
      ) => [kakaoAuthService, naverAuthService],
      inject: [KakaoAuthService, NaverAuthService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
