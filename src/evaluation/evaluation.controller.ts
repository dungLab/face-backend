import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { EvaluationTargetType } from '@/evaluation/constants';
import { EvaluationService } from '@/evaluation/evaluation.service';
import { UserEntity } from '@/user/entities/user.entity';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':targetType')
  getOne(
    @User() user: UserEntity,
    @Param('targetType') targetType: EvaluationTargetType,
  ) {
    return this.evaluationService.getOne(user, targetType);
  }
}
