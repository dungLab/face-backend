import { AppController } from '@/app.controller';
import { SwaggerMethodDoc } from '@/docs/types';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
