import { EvaluationRepository } from '@/main/evaluation/repositories/evaluation.repository';
import { LogModule } from '@/sub/log/log.module';
import { PhotoModule } from '@/main/photo/photo.module';
import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [PhotoModule, LogModule],
  controllers: [EvaluationController],
  providers: [
    // services
    EvaluationService,

    //repositories
    EvaluationRepository,
  ],
})
export class EvaluationModule {}
