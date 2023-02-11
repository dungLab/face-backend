import { SwaggerMethodDoc } from '@/common/docs/types';
import { LoginResponseDto } from '@/main/auth/dtos/response/login-response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthController } from './auth.controller';

export const ApiDocs: SwaggerMethodDoc<AuthController> = {
  kakaoLogin(summary) {
    return applyDecorators(
      ApiOperation({
        summary: summary,
        description: '카카오를 이용한 로그인 및 회원가입',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: '사용자 정상 생성',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
  kakaoCallback(summary) {
    return applyDecorators(
      ApiOperation({
        summary: summary,
        description: '카카오 call back',
      }),
      ApiResponse({
        status: 201,
        type: LoginResponseDto,
        description: '사용자 정상 생성',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
  refreshToken(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: 'refreshToken으로 accessToken 재발급',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: 'access token string으로 응답 됨',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
