import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FileController } from '@/file/file.controller';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';
import { SwaggerMethodDoc } from '@/common/docs/types';
import { FolderType } from '@/file/constants';

export const ApiDocs: SwaggerMethodDoc<FileController> = {
  uploadImage(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiConsumes('multipart/form-data'),
      ApiParam({
        name: 'type',
        type: 'string',
        enum: [FolderType.PHOTO, FolderType.PROFILE],
      }),
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
        description: '이미지 한개 업로드',
      }),
      ApiResponse({
        status: 201,
        type: FileReponseDto,
        description: '이미지 한개 업로드 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
