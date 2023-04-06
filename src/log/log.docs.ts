import { SwaggerMethodDoc } from '@/common/docs/types';
import { LogController } from '@/log/log.controller';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiDocs: SwaggerMethodDoc<LogController> = {
  loggingPhotoView(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiParam({
        name: 'photoId',
        type: 'number',
        description: 'photo id',
      }),
      ApiOperation({
        summary: summary,
        description: '평가 위해 조회한 포토 하나 로깅',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: '평가 위해 조회한 포토 하나 로깅 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
