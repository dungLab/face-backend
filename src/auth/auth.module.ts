import { Module } from '@nestjs/common';
import { AUTH_SERVICES_INJECT_TOKEN } from './constants';
import { KakaoAuthService } from './services/kakao-auth.service';
import { AuthController } from './auth.controller';
import { NaverAuthService } from './services/naver-auth.service';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from '@/auth/jwt.strategy';

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
