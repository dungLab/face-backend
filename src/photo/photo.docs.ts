import { PhotoController } from '@/photo/photo.controller';
import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { SwaggerMethodDoc } from '@/docs/types';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiDocs: SwaggerMethodDoc<PhotoController> = {
  upload(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      }),
      ApiOperation({
        summary: summary,
        description: '로그인한 유저가 앨범 하나 업로드',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: '앨범 생성 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
  getMany(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: '내 앨범 리스트 조회',
      }),
      ApiResponse({
        status: 201,
        type: PhotoResponseDto,
        description: '앨범 리스트 조회 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
