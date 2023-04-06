import { SwaggerMethodDoc } from '@/common/docs/types';
import { UpdateUserDto } from '@/user/dtos/request/update-user.dto';
import { UserReseponseDto } from '@/user/dtos/response/user-response.dto';
import { UserController } from '@/user/user.controller';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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
  update(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiBody({
        type: UpdateUserDto,
      }),
      ApiOperation({
        summary: summary,
        description: '유저 정보 수정',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: '유저 정보 수정 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
