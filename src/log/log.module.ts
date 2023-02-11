import { LogEvaluationRepository } from '@/log/repositories/log-evaluation.repository';
import { Module } from '@nestjs/common';
import { LogService } from './log.service';

@Module({
  providers: [
    LogService,
    //repositories
    LogEvaluationRepository,
  ],
  exports: [LogEvaluationRepository],
})
export class LogModule {}
