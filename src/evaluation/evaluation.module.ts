import { EvaluationRepository } from '@/evaluation/repositories/evaluation.repository';
import { LogModule } from '@/log/log.module';
import { PhotoModule } from '@/photo/photo.module';
import { forwardRef, Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [forwardRef(() => PhotoModule), LogModule],
  controllers: [EvaluationController],
  providers: [
    // services
    EvaluationService,

    //repositories
    EvaluationRepository,
  ],
  exports: [EvaluationRepository],
})
export class EvaluationModule {}
