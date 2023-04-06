import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { getDateFormat } from '@/common/utils/date.util';
import { UserEntity } from '@/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@/common/error-response.exception';
import { PhotoRequestDto } from '@/photo/dtos/request/photo-request.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { HashTagReository } from '@/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/photo/repositories/photo-hashtag.repository';
import { HashTagEntity } from '@/photo/entities/hashtag.entity';
import { Builder } from 'builder-pattern';
import * as _ from 'lodash';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import { PhotoHashTagEntity } from '@/photo/entities/photo-hashtag.entity';
import { FileRepository } from '@/file/repositories/file.repository';
import { PHOTO_SPAN_LIST } from '@/photo/constants';
import { PhotoCreateInfoResponseDto } from '@/photo/dtos/response/photo-create-info-response.dto';
import { EvaluationRepository } from '@/evaluation/repositories/evaluation.repository';
import { UserReseponseDto } from '@/user/dtos/response/user-response.dto';
import { PhotoListResponseDto } from '@/photo/dtos/response/photo-list-response.dto';

@Injectable()
export class PhotoService {
  constructor(
    //services
    private readonly dataSource: DataSource,

    //repositories
    private readonly photoRepository: PhotoRepository,
    private readonly hashTagRepository: HashTagReository,
    private readonly photoHashTagRepository: PhotoHashTagRepository,
    private readonly fileRepository: FileRepository,
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async create(user: UserEntity, photoRequestDto: PhotoRequestDto) {
    const { fileId, span, hashTags, description } = photoRequestDto;

    const foundFileEntity = await this.fileRepository.findOne({
      where: {
        id: fileId,
      },
    });

    if (!foundFileEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'there is no file',
        code: -1,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const expiredAt = Date.now() + span;

      const photoEntity = Builder(PhotoEntity)
        .fileId(fileId)
        .userId(user.id)
        .expiredAt(new Date(expiredAt))
        .description(description)
        .build();

      const savedPhotoEntity = await queryRunner.manager.save(photoEntity);

      if (hashTags && hashTags.length > 0) {
        // hash tag 처리
        await this.createHashTags(hashTags, savedPhotoEntity.id, queryRunner);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return true;
  }

  async createHashTags(
    hashTags: string[],
    photoId: number,
    queryRunner: QueryRunner,
  ) {
    const alreadyExistedHashTagEntities =
      hashTags.length > 0
        ? await this.hashTagRepository.findManyByNames(hashTags, queryRunner)
        : [];

    const newHashTagEntities = [...new Set(hashTags)].map(
      (_d): HashTagEntity => {
        return Builder(HashTagEntity).name(_d).build();
      },
    );

    const hasSaveTagEntities = newHashTagEntities.filter((n) => {
      return !alreadyExistedHashTagEntities.find((a) => a.name === n.name);
    });

    // hashtag
    const savedHashTags = await queryRunner.manager.save(hasSaveTagEntities);

    const alreadyHashTagIds = alreadyExistedHashTagEntities.map((_d) => _d.id);
    const savedHashTagIds = savedHashTags.map((_d) => _d.id);

    const hasSavePhotoHashTagEntities = [
      ...alreadyHashTagIds,
      ...savedHashTagIds,
    ].map((hashTagId) => {
      return Builder(PhotoHashTagEntity)
        .photoId(photoId)
        .hashTagId(hashTagId)
        .build();
    });

    // photo-hashtag
    await queryRunner.manager.save(hasSavePhotoHashTagEntities);

    return true;
  }

  async findMany(user: UserEntity): Promise<PhotoListResponseDto> {
    const userId = user.id;

    const foundPhotoEntities =
      await this.photoRepository.findManyCursorByUserId(userId);

    const photos = await Promise.all(
      foundPhotoEntities.map(async (_d) => {
        const { likePercentage, viewCount, likeCount, hateCount } =
          await this._getPhotoReactionInfo(_d);

        return Builder(PhotoResponseDto)
          .id(_d.id)
          .url(_d.file.url)
          .description(_d.description)
          .expiredAt(getDateFormat(_d.expiredAt))
          .user(
            Builder(UserReseponseDto)
              .id(_d.user.id)
              .createdAt(getDateFormat(_d.user.createdAt))
              .email(_d.user.email)
              .nickName(_d.user.nickName)
              .build(),
          )
          .createdAt(getDateFormat(_d.createdAt))
          .hashTags(_d.photoHashTags.map((__d) => __d.hashTag.name))
          .likePercentage(likePercentage)
          .viewCount(viewCount)
          .likeCount(likeCount)
          .hateCount(hateCount)
          .build();
      }),
    );

    return {
      photos,
      info: {
        // TODO: pagination 구현
        totalCount: photos.length,
        // TODO: pagination 구현
        endCursor: 'dflkjie@dlkfjasd',
        // TODO: pagination 구현
        hasNextPage: true,
        // TODO: pagination 구현
        pageSize: 10,
      },
    };
  }

  async findOne(user: UserEntity, id: number): Promise<PhotoResponseDto> {
    const foundPhotoEntity = await this.photoRepository.findOneById(id);

    if (!foundPhotoEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'there is no photo',
        code: -1,
      });
    }

    const { likePercentage, viewCount, likeCount, hateCount } =
      await this._getPhotoReactionInfo(foundPhotoEntity);

    return Builder(PhotoResponseDto)
      .id(foundPhotoEntity.id)
      .url(foundPhotoEntity.file.url)
      .description(foundPhotoEntity.description)
      .expiredAt(getDateFormat(foundPhotoEntity.expiredAt))
      .user(
        Builder(UserReseponseDto)
          .id(foundPhotoEntity.user.id)
          .createdAt(getDateFormat(foundPhotoEntity.user.createdAt))
          .email(foundPhotoEntity.user.email)
          .nickName(foundPhotoEntity.user.nickName)
          .build(),
      )
      .createdAt(getDateFormat(foundPhotoEntity.createdAt))
      .hashTags(foundPhotoEntity.photoHashTags.map((_d) => _d.hashTag.name))
      .likePercentage(likePercentage)
      .viewCount(viewCount)
      .likeCount(likeCount)
      .hateCount(hateCount)
      .build();
  }

  private async _getPhotoReactionInfo(photo: PhotoEntity): Promise<{
    likePercentage: string;
    viewCount: number;
    likeCount: number;
    hateCount: number;
  }> {
    // 인증 유저가 조회하려는 포토 본인이면
    const foundEvaluationEntities =
      await this.evaluationRepository.findManyByPhotoId(photo.id);

    const likeCount = foundEvaluationEntities.filter((_d) => _d.isGood).length;
    const hateCount = foundEvaluationEntities.filter((_d) => !_d.isGood).length;
    const viewCount = likeCount + hateCount;

    return {
      // 소수 둘째자리에서 반올림
      likePercentage:
        viewCount === 0
          ? '0.0%'
          : `${((likeCount / (likeCount + hateCount)) * 100).toFixed(1)}%`,
      viewCount,
      likeCount,
      hateCount,
    };
  }

  getInfoForCreation() {
    return Builder(PhotoCreateInfoResponseDto).spans(PHOTO_SPAN_LIST).build();
  }
}
