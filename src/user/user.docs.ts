import { UserReseponseDto } from '@/user/dtos/response/user-response.dto';
import { UserController } from '@/user/user.controller';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethodDoc } from 'src/docs/types';

export const ApiDocs: SwaggerMethodDoc<UserController> = {
  getInfo(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: '로그인한 유저 정보 조회',
      }),
      ApiResponse({
        status: 201,
        type: UserReseponseDto,
        description: '사용자 정상 생성',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
