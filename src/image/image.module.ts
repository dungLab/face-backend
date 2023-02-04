import { S3Module } from '@/s3/s3.module';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [S3Module],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
