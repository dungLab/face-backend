import { PhotoResponseDto } from '@/main/photo/dtos/response/photo-response.dto';
import { PhotoRepository } from '@/main/photo/repositories/photo.repository';
import { getDateFormat } from '@/common/utils/date.util';
import { UserEntity } from '@/main/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@/common/error-response.exception';
import { PhotoRequestDto } from '@/main/photo/dtos/request/photo-request.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { HashTagReository } from '@/main/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/main/photo/repositories/photo-hashtag.repository';
import { HashTagEntity } from '@/main/photo/entities/hashtag.entity';
import { Builder } from 'builder-pattern';
import * as _ from 'lodash';
import { PhotoEntity } from '@/main/photo/entities/photo.entity';
import { PhotoHashTagEntity } from '@/main/photo/entities/photo-hashtag.entity';
import { FileRepository } from '@/sub/file/repositories/file.repository';
import { PHOTO_SPAN_LIST } from '@/main/photo/constants';
import { PhotoCreateInfoResponseDto } from '@/main/photo/dtos/response/photo-create-info-response.dto';

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

      if (hashTags) {
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
      await this.hashTagRepository.findManyByNames(hashTags, queryRunner);

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

  async findMany(user: UserEntity): Promise<PhotoResponseDto[]> {
    const userId = user.id;

    const foundPhotoEntities =
      await this.photoRepository.findManyCursorByUserId(userId);

    return foundPhotoEntities.map((_d) => {
      return Builder(PhotoResponseDto)
        .id(_d.id)
        .url(_d.file.url)
        .description(_d.description)
        .expiredAt(getDateFormat(_d.expiredAt))
        .userNickName(_d.user.nickName)
        .createdAt(getDateFormat(_d.createdAt))
        .hashTags(_d.photoHashTags.map((__d) => __d.hashTag.name))
        .build();
    });
  }

  async findOne(id: number): Promise<PhotoResponseDto> {
    const foundPhotoEntity = await this.photoRepository.findOneById(id);

    if (!foundPhotoEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'there is no photo',
        code: -1,
      });
    }

    return Builder(PhotoResponseDto)
      .id(foundPhotoEntity.id)
      .url(foundPhotoEntity.file.url)
      .description(foundPhotoEntity.description)
      .expiredAt(getDateFormat(foundPhotoEntity.expiredAt))
      .userNickName(foundPhotoEntity.user.nickName)
      .createdAt(getDateFormat(foundPhotoEntity.createdAt))
      .hashTags(foundPhotoEntity.photoHashTags.map((_d) => _d.hashTag.name))
      .build();
  }

  getInfoForCreation() {
    return Builder(PhotoCreateInfoResponseDto).spans(PHOTO_SPAN_LIST).build();
  }
}
