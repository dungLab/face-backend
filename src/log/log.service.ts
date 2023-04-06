import { UserEntity } from '@/user/entities/user.entity';
import { LogEvaluationRepository } from '@/log/repositories/log-evaluation.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  constructor(
    private readonly logEvaluationRepository: LogEvaluationRepository,
  ) {}

  async loggingViewForEvaluation(user: UserEntity, photoId: number) {
    this.logEvaluationRepository.save({
      isGet: true,
      userId: user.id,
      photoId: photoId,
    });

    return true;
  }
}
