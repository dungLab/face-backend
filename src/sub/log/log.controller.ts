import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { User } from '@/main/auth/user.decorator';
import { UserEntity } from '@/main/user/entities/user.entity';
import { ApiDocs } from '@/sub/log/log.docs';
import { LogService } from '@/sub/log/log.service';
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
