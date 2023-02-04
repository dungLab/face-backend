import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { S3Module } from '@/s3/s3.module';
import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [S3Module],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoRepository],
})
export class PhotoModule {}
