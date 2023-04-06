import { LogEvaluationRepository } from '@/log/repositories/log-evaluation.repository';
import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  providers: [
    LogService,
    //repositories
    LogEvaluationRepository,
  ],
  exports: [LogEvaluationRepository],
  controllers: [LogController],
})
export class LogModule {}
