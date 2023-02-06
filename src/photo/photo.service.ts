import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { getDateFormat } from '@/common/utils/date.util';
import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
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

@Injectable()
export class PhotoService {
  constructor(
    //services
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,

    //repositories
    private readonly photoRepository: PhotoRepository,
    private readonly hashTagRepository: HashTagReository,
    private readonly photoHashTagRepository: PhotoHashTagRepository,
  ) {}

  async create(
    user: UserEntity,
    image: Express.Multer.File,
    photoRequestDto: PhotoRequestDto,
  ) {
    const uploadedFileUrl = await this.s3Service.upload(
      image,
      'ap-northeast-2',
      S3BucketType.FACE,
      process.env.NODE_ENV === 'production'
        ? FaceFolderType.PRODUCTION
        : FaceFolderType.DEVELOPMENT,
    );

    const { span, hashTags, description } = photoRequestDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const photoEntity = Builder(PhotoEntity)
        .url(uploadedFileUrl)
        .userId(user.id)
        .span(span)
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

    const newHashTagEntities = hashTags.map((_d): HashTagEntity => {
      return Builder(HashTagEntity).name(_d).build();
    });

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
        .url(_d.url)
        .description(_d.description)
        .span(_d.span)
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
      .url(foundPhotoEntity.url)
      .description(foundPhotoEntity.description)
      .span(foundPhotoEntity.span)
      .userNickName(foundPhotoEntity.user.nickName)
      .createdAt(getDateFormat(foundPhotoEntity.createdAt))
      .hashTags(foundPhotoEntity.photoHashTags.map((_d) => _d.hashTag.name))
      .build();
  }
}
