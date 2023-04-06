import { SwaggerMethodDoc } from '@/common/docs/types';
import { EvaluationTargetType } from '@/evaluation/constants';
import { EvaluationRequestDto } from '@/evaluation/dtos/request/evaluation-request.dto';
import { EvaluationResponseDto } from '@/evaluation/dtos/response/evaluation-response.dto';
import { EvaluationController } from '@/evaluation/evaluation.controller';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiDocs: SwaggerMethodDoc<EvaluationController> = {
  getMany(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiParam({
        name: 'targetType',
        type: 'string',
        enum: [EvaluationTargetType.ALL],
      }),
      ApiOperation({
        summary: summary,
        description:
          '평가할 포토 만료기간 얼마 남지 않은 포토부터 리스트로 조회',
      }),
      ApiResponse({
        status: 201,
        type: EvaluationResponseDto,
        isArray: true,
        description: '평가할 포토 리스트 조회 성공 (없으면 null응답)',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },

  evaluateOne(summary) {
    return applyDecorators(
      ApiBearerAuth('jwt'),
      ApiParam({
        name: 'photoId',
        type: 'number',
      }),
      ApiBody({
        type: EvaluationRequestDto,
      }),
      ApiOperation({
        summary: summary,
        description: 'photoId로 포토 하나 평가',
      }),
      ApiResponse({
        status: 201,
        type: Boolean,
        description: 'photoId로 포토 평가 성공',
      }),
      ApiResponse({ status: 403, description: 'Forbidden.' }),
    );
  },
};
