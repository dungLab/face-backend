import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethodDoc } from 'src/docs/types';
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
        type: LoginResponseDto,
        description: '사용자 정상 생성',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
