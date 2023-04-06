import { FileModule } from '@/file/file.module';
import { HashTagReository } from '@/photo/repositories/hashtag.repository';
import { PhotoHashTagRepository } from '@/photo/repositories/photo-hashtag.repository';
import { PhotoRepository } from '@/photo/repositories/photo.repository';
import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { EvaluationModule } from '@/evaluation/evaluation.module';

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
