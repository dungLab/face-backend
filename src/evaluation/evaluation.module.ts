import { EvaluationRepository } from '@/evaluation/repositories/evaluation.repository';
import { PhotoModule } from '@/photo/photo.module';
import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [PhotoModule],
  controllers: [EvaluationController],
  providers: [
    // services
    EvaluationService,

    //repositories
    EvaluationRepository,
  ],
})
export class EvaluationModule {}
