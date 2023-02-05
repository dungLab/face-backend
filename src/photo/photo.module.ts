import { HashTagReository } from '@/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/photo/repositories/photo-hashtag.repository';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { S3Module } from '@/s3/s3.module';
import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [S3Module],
  controllers: [PhotoController],
  providers: [
    //services
    PhotoService,

    //repositories
    PhotoRepository,
    HashTagReository,
    PhotoHashTagRepository,
  ],
})
export class PhotoModule {}
