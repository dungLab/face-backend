import { PhotoController } from '@/photo/photo.controller';
import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { SwaggerMethodDoc } from '@/docs/types';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PhotoRequestDto } from '@/photo/dtos/request/photo-request.dto';

export const ApiDocs: SwaggerMethodDoc<PhotoController> = {
  create(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiBody({
        type: PhotoRequestDto,
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
