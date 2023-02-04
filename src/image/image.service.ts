import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(
    //services
    private readonly s3Service: S3Service,
  ) {}
  async uploadImage(image: Express.Multer.File) {
    // return
    return await this.s3Service.upload(
      image,
      'ap-northeast-2',
      S3BucketType.FACE,
      process.env.NODE_ENV === 'production'
        ? FaceFolderType.PRODUCTION
        : FaceFolderType.DEVELOPMENT,
    );
  }
}
