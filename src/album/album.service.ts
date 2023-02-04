import { AlbumRepository } from '@/album/repositories/album.repository';
import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { UserEntity } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlbumService {
  constructor(
    //services
    private readonly s3Service: S3Service,

    //repositories
    private readonly albumRepository: AlbumRepository,
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

    await this.albumRepository.save({
      url: uploadedFileUrl,
      userId: user.id,
    });

    return true;
  }
}
