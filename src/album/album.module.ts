import { S3Module } from '@/s3/s3.module';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [S3Module],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
