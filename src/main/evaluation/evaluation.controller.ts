import { PaginationRequestDto } from '@/common/dtos/request/pagination-request.dto';
import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { User } from '@/main/auth/user.decorator';
import { EvaluationTargetType } from '@/main/evaluation/constants';
import { EvaluationRequestDto } from '@/main/evaluation/dtos/request/evaluation-request.dto';
import { ApiDocs } from '@/main/evaluation/evaluation.docs';
import { EvaluationService } from '@/main/evaluation/evaluation.service';
import { UserEntity } from '@/main/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > 평가')
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @ApiDocs.getMany('평가할 포토 리스트 조회')
  @UseGuards(JwtAuthGuard)
  @Get(':targetType')
  getMany(
    @User() user: UserEntity,
    @Param('targetType') targetType: EvaluationTargetType,
    @Query() query: PaginationRequestDto,
  ) {
    return this.evaluationService.getMany(user, targetType, query);
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
