import { ErrorResponse } from '@/common/error-response.exception';
import { getDateFormat, getNowDate } from '@/common/utils/date.util';
import { EvaluationTargetType } from '@/evaluation/constants';
import { EvaluationRequestDto } from '@/evaluation/dtos/request/evaluation-request.dto';
import { EvaluationResponseDto } from '@/evaluation/dtos/response/evaluation-response.dto';
import { EvaluationEntity } from '@/evaluation/entities/evaluation.entity';
import { EvaluationRepository } from '@/evaluation/repositories/evaluation.repository';
import { LogEvaluationRepository } from '@/log/repositories/log-evaluation.repository';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { UserEntity } from '@/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PaginationRequestDto } from '@/common/dtos/request/pagination-request.dto';
import { EPhotoStatus } from '@/photo/constants';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';
import { FileMetaType } from '@/file/constants';

@Injectable()
export class EvaluationService {
  constructor(
    //repositories
    private readonly evaluationRepository: EvaluationRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly logEvaluationRepository: LogEvaluationRepository,
  ) {}

  async getMany(
    user: UserEntity,
    targetType: EvaluationTargetType,
    query: PaginationRequestDto,
  ): Promise<EvaluationResponseDto[]> {
    switch (targetType) {
      case EvaluationTargetType.ALL: {
        // 1. 평가할 photoEntities select
        const foundSimplePhotoEntities =
          await this.photoRepository.findManyForEvaluation(
            user.id,
            query.pageSize,
          );

        if (foundSimplePhotoEntities.length === 0) {
          return [];
        }

        const photoIdsForEvaluation = foundSimplePhotoEntities.map(
          (_d) => _d.id,
        );

        // 2. select detail by photoId(위에서 조회한)
        const foundDetailPhotoEntities =
          photoIdsForEvaluation.length > 0
            ? await this.photoRepository.findManyByIds(photoIdsForEvaluation)
            : [];

        return foundDetailPhotoEntities.map((foundDetailPhotoEntity) => {
          const photoStatus =
            foundDetailPhotoEntity.expiredAt > new Date()
              ? EPhotoStatus.EVALUATING
              : EPhotoStatus.EVALUATED;

          return Builder(EvaluationResponseDto)
            .id(foundDetailPhotoEntity.id)
            .image(
              Builder(FileReponseDto)
                .id(foundDetailPhotoEntity.file.id)
                .type(foundDetailPhotoEntity.file.type)
                .url(
                  foundDetailPhotoEntity.file.metas.find(
                    (d) => d.key === FileMetaType.URL,
                  ).value,
                )
                .publicId(
                  foundDetailPhotoEntity.file.metas.find(
                    (d) => d.key === FileMetaType.PUBLIC_ID,
                  ).value,
                )
                .createdAt(getDateFormat(foundDetailPhotoEntity.file.createdAt))
                .build(),
            )
            .description(foundDetailPhotoEntity.description)
            .status(photoStatus)
            .expiredAt(getDateFormat(foundDetailPhotoEntity.expiredAt))
            .createdAt(getDateFormat(foundDetailPhotoEntity.createdAt))
            .hashTags(
              foundDetailPhotoEntity.photoHashTags.map((_d) => _d.hashTag.name),
            )
            .likePercentage(null)
            .viewCount(null)
            .likeCount(null)
            .hateCount(null)
            .build();
        });
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

    const isOverExpired = getNowDate() > foundSimplePhotoEntity.expiredAt;
    if (isOverExpired) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'over evaluation expired time',
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
