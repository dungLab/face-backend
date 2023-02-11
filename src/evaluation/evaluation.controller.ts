import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { EvaluationTargetType } from '@/evaluation/constants';
import { EvaluationRequestDto } from '@/evaluation/dtos/request/evaluation-request.dto';
import { ApiDocs } from '@/evaluation/evaluation.docs';
import { EvaluationService } from '@/evaluation/evaluation.service';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > 평가')
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @ApiDocs.getOne('평가할 사진 하나 조회')
  @UseGuards(JwtAuthGuard)
  @Get(':targetType')
  getOne(
    @User() user: UserEntity,
    @Param('targetType') targetType: EvaluationTargetType,
  ) {
    return this.evaluationService.getOne(user, targetType);
  }

  @ApiDocs.evaluateOne('photoId로 포토 평가')
  @UseGuards(JwtAuthGuard)
  @Post(':photoId')
  evaluateOne(
    @User() user: UserEntity,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Body() evaluationRequestDto: EvaluationRequestDto,
  ) {
    return this.evaluationService.evaluateOne(
      user,
      photoId,
      evaluationRequestDto,
    );
  }
}
