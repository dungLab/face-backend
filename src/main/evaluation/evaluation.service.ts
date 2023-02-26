import { ErrorResponse } from '@/common/error-response.exception';
import { getDateFormat, getNowDate } from '@/common/utils/date.util';
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
import { UserReseponseDto } from '@/main/user/dtos/response/user-response.dto';
import { PaginationRequestDto } from '@/common/dtos/request/pagination-request.dto';

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
  ): Promise<EvaluationResponseDto[] | null> {
    switch (targetType) {
      case EvaluationTargetType.ALL: {
        // 1. 평가할 photoEntities select
        const foundSimplePhotoEntities =
          await this.photoRepository.findManyForEvaluation(
            user.id,
            query.pageSize,
          );

        if (foundSimplePhotoEntities.length === 0) {
          return null;
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
          return Builder(EvaluationResponseDto)
            .id(foundDetailPhotoEntity.id)
            .url(foundDetailPhotoEntity.file.url)
            .description(foundDetailPhotoEntity.description)
            .expiredAt(getDateFormat(foundDetailPhotoEntity.expiredAt))
            .user(
              Builder(UserReseponseDto)
                .id(foundDetailPhotoEntity.user.id)
                .createdAt(getDateFormat(foundDetailPhotoEntity.user.createdAt))
                .email(foundDetailPhotoEntity.user.email)
                .nickName(foundDetailPhotoEntity.user.nickName)
                .build(),
            )
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
