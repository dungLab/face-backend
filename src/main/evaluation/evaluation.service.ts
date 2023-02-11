import { ErrorResponse } from '@/common/error-response.exception';
import { getDateFormat } from '@/common/utils/date.util';
import { EvaluationTargetType } from '@/main/evaluation/constants';
import { EvaluationRequestDto } from '@/main/evaluation/dtos/request/evaluation-request.dto';
import { EvaluationResponseDto } from '@/main/evaluation/dtos/response/evaluation-response.dto';
import { EvaluationEntity } from '@/main/evaluation/entities/evaluation.entity';
import { EvaluationRepository } from '@/main/evaluation/repositories/evaluation.repository';
import { LogEvaluationRepository } from '@/sub/log/repositories/log-evaluation.repository';
import { PhotoRepository } from '@/main/photo/repositories/photo.repository';
import { UserEntity } from '@/main/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';

@Injectable()
export class EvaluationService {
  constructor(
    //repositories
    private readonly evaluationRepository: EvaluationRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly logEvaluationRepository: LogEvaluationRepository,
  ) {}

  async getOne(
    user: UserEntity,
    targetType: EvaluationTargetType,
  ): Promise<EvaluationResponseDto | null> {
    switch (targetType) {
      case EvaluationTargetType.ALL: {
        // 1. select one 평가할 photoEntity
        const foundSimplePhotoEntity =
          await this.photoRepository.findOneForEvaluation(user.id);

        if (!foundSimplePhotoEntity) {
          return null;
        }

        const { id } = foundSimplePhotoEntity;

        // 2. select detail by photoId(위에서 조회한)
        const foundDetailPhotoEntity = await this.photoRepository.findOneById(
          id,
        );

        // log
        this.logEvaluationRepository.save({
          userId: user.id,
          photoId: id,
          isGet: true,
        });

        return Builder(EvaluationResponseDto)
          .id(foundDetailPhotoEntity.id)
          .url(foundDetailPhotoEntity.file.url)
          .description(foundDetailPhotoEntity.description)
          .expiredAt(getDateFormat(foundDetailPhotoEntity.expiredAt))
          .userNickName(foundDetailPhotoEntity.user.nickName)
          .createdAt(getDateFormat(foundDetailPhotoEntity.createdAt))
          .hashTags(
            foundDetailPhotoEntity.photoHashTags.map((_d) => _d.hashTag.name),
          )
          .build();
      }
      default: {
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
          message: 'undefined targetType',
          code: -1,
        });
      }
    }
  }

  async evaluateOne(
    user: UserEntity,
    photoId: number,
    evaluationRequestDto: EvaluationRequestDto,
  ) {
    const userId = user.id;

    const alreadyExistedEvaluationEntity =
      await this.evaluationRepository.findOneByUserIdAndPhotoId(
        userId,
        photoId,
      );

    if (alreadyExistedEvaluationEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'already evaluated',
        code: -1,
      });
    }

    const foundSimplePhotoEntity = await this.photoRepository.findSimpleOneById(
      photoId,
    );

    if (!foundSimplePhotoEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'there is no photo',
        code: -1,
      });
    }

    if (userId === foundSimplePhotoEntity.userId) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'could not evalute my photo',
        code: -1,
      });
    }

    // 1.insert evaluation record
    const evaluationEntity = Builder(EvaluationEntity)
      .isGood(evaluationRequestDto.isGood)
      .userId(userId)
      .photoId(foundSimplePhotoEntity.id)
      .build();

    await this.evaluationRepository.save(evaluationEntity);

    // log
    this.logEvaluationRepository.save({
      userId,
      photoId,
      isGet: false,
      isGood: evaluationRequestDto.isGood,
    });

    return true;
  }
}
