import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { ApiDocs } from '@/log/log.docs';
import { LogService } from '@/log/log.service';
import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > logging')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiDocs.loggingPhotoView('평가 위해 조회한 포토 하나 로깅')
  @UseGuards(JwtAuthGuard)
  @Post('evaluation/photo-view/:photoId')
  loggingPhotoView(
    @User() user: UserEntity,
    @Param('photoId', ParseIntPipe) photoId: number,
  ) {
    return this.logService.loggingViewForEvaluation(user, photoId);
  }
}
