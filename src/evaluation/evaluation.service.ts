import { ErrorResponse } from '@/common/error-response.exception';
import { EvaluationTargetType } from '@/evaluation/constants';
import { EvaluationResponseDto } from '@/evaluation/dtos/response/evaluation-response.dto';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { UserEntity } from '@/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EvaluationService {
  constructor(
    //repositories
    private readonly photoRepository: PhotoRepository,
  ) {}

  async getOne(
    user: UserEntity,
    targetType: EvaluationTargetType,
  ): Promise<EvaluationResponseDto> {
    switch (targetType) {
      case EvaluationTargetType.ALL: {
      }
      default: {
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
          message: 'undefined targetType',
          code: -1,
        });
      }
    }
  }
}
