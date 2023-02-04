import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { getDateFormat } from '@/common/utils/date.util';
import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { UserEntity } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoService {
  constructor(
    //services
    private readonly s3Service: S3Service,

    //repositories
    private readonly photoRepository: PhotoRepository,
  ) {}

  async upload(user: UserEntity, image: Express.Multer.File) {
    const uploadedFileUrl = await this.s3Service.upload(
      image,
      'ap-northeast-2',
      S3BucketType.FACE,
      process.env.NODE_ENV === 'production'
        ? FaceFolderType.PRODUCTION
        : FaceFolderType.DEVELOPMENT,
    );

    await this.photoRepository.save({
      url: uploadedFileUrl,
      userId: user.id,
    });

    return true;
  }

  async findMany(user: UserEntity): Promise<PhotoResponseDto[]> {
    const userId = user.id;

    const foundPhotoEntities =
      await this.photoRepository.findManyCursorByUserId(userId);

    return foundPhotoEntities.map((_d) => {
      return {
        url: _d.url,
        createdAt: getDateFormat(_d.createdAt),
      };
    });
  }
}