import { AlbumController } from '@/album/album.controller';
import { SwaggerMethodDoc } from '@/docs/types';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiDocs: SwaggerMethodDoc<AlbumController> = {
  upload(summary) {
    return applyDecorators(
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
};
