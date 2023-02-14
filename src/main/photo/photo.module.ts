import { FileModule } from '@/sub/file/file.module';
import { HashTagReository } from '@/main/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/main/photo/repositories/photo-hashtag.repository';
import { PhotoRepository } from '@/main/photo/repositories/photo.repository';
import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { EvaluationModule } from '@/main/evaluation/evaluation.module';

@Module({
  imports: [FileModule, EvaluationModule],
  controllers: [PhotoController],
  providers: [
    //services
    PhotoService,

    //repositories
    PhotoRepository,
    HashTagReository,
    PhotoHashTagRepository,
  ],
  exports: [PhotoRepository],
})
export class PhotoModule {}
