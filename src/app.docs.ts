import { AppController } from '@/app.controller';
import { SwaggerMethodDoc } from '@/common/docs/types';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiDocs: SwaggerMethodDoc<AppController> = {
  healthCheck(summary) {
    return applyDecorators(
      ApiOperation({
        summary: summary,
        description: 'healthCheck endpoint',
      }),
      ApiResponse({
        status: 200,
        type: String,
        description: 'healthCheck endpoint',
      }),
    );
  },
  jwtTest(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiOperation({
        summary: summary,
        description: 'jwt test api',
      }),
      ApiResponse({
        status: 200,
        type: String,
        description: 'success',
      }),
    );
  },
};
