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
  create(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            span: {
              type: 'number',
              description: 'hour 기준',
            },
            description: { type: 'string', description: '포토 설명' },
            hashTag: {
              type: 'string',
              nullable: true,
              description: '해시태그 (,)로 구분하여 요청',
            },
            image: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      }),
      ApiOperation({
        summary: summary,
        description: '로그인한 유저가 포토 하나 생성',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: '포토 생성 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
  getMany(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: '내 포토 리스트 조회',
      }),
      ApiResponse({
        status: 201,
        type: PhotoResponseDto,
        isArray: true,
        description: '포토 리스트 조회 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
  getOne(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: '포토 id로 하나 조회',
      }),
      ApiResponse({
        status: 201,
        type: PhotoResponseDto,
        description: '포토 조회 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
