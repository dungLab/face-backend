import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { getDateFormat } from '@/common/utils/date.util';
import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { UserEntity } from '@/user/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@/common/error-response.exception';
import { PhotoRequestDto } from '@/photo/dtos/request/photo-request.dto';
import { DataSource } from 'typeorm';
import { HashTagReository } from '@/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/photo/repositories/photo-hashtag.repository';
import { HashTagEntity } from '@/photo/entities/hashtag.entity';
import * as _ from 'lodash';

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

  async upload(
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

    const { span, hashTag, description } = photoRequestDto;

    const savedPhotoEntity = await this.photoRepository.save({
      url: uploadedFileUrl,
      userId: user.id,
      span,
      description,
    });

    if (hashTag) {
      await this.saveHashTags(hashTag, savedPhotoEntity.id);
    }

    return true;
  }

  async saveHashTags(hashTag: string, photoId: number) {
    const hashTagArr = hashTag.split(',').map((_d) => _d.trim());

    const alreadyExistedHashTagEntities =
      await this.hashTagRepository.findManyByNames(hashTagArr);

    const newHashTagEntities = hashTagArr.map((_d): HashTagEntity => {
      return this.hashTagRepository.create({
        name: _d,
      });
    });

    const hasSaveTagEntities = newHashTagEntities.filter((n) => {
      return !alreadyExistedHashTagEntities.find((a) => a.name === n.name);
    });

    // hashtag
    const savedHashTags = await this.hashTagRepository.save(hasSaveTagEntities);

    const alreadyHashTagIds = alreadyExistedHashTagEntities.map((_d) => _d.id);
    const savedHashTagIds = savedHashTags.map((_d) => _d.id);

    const hasSavePhotoHashTagEntities = [
      ...alreadyHashTagIds,
      ...savedHashTagIds,
    ].map((hashTagId) => {
      return this.photoHashTagRepository.create({
        photoId,
        hashTagId,
      });
    });

    // photo-hashtag
    await this.photoHashTagRepository.save(hasSavePhotoHashTagEntities);

    return true;
  }

  async findMany(user: UserEntity): Promise<PhotoResponseDto[]> {
    const userId = user.id;

    const foundPhotoEntities =
      await this.photoRepository.findManyCursorByUserId(userId);

    return foundPhotoEntities.map((_d) => {
      return {
        id: _d.id,
        url: _d.url,
        createdAt: getDateFormat(_d.createdAt),
      };
    });
  }

  async findOne(id: number): Promise<PhotoResponseDto> {
    const foundPhotoEntity = await this.photoRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundPhotoEntity) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'there is no photo',
        code: -1,
      });
    }

    return {
      id: foundPhotoEntity.id,
      url: foundPhotoEntity.url,
      createdAt: getDateFormat(foundPhotoEntity.createdAt),
    };
  }
}
