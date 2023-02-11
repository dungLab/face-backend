import { LogEvaluationEntity } from '@/log/entities/log-evaluation.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LogEvaluationRepository extends Repository<LogEvaluationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LogEvaluationEntity, dataSource.createEntityManager());
  }
}
