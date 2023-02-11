import { SwaggerMethodDoc } from '@/common/docs/types';
import { UserReseponseDto } from '@/main/user/dtos/response/user-response.dto';
import { UserController } from '@/main/user/user.controller';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
