import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { ErrorResponse } from '@/common/error-response.exception';
import { AlbumService } from '@/album/album.service';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiDocs } from '@/album/album.docs';
import { CursorPaginationRequestDto } from '@/common/dtos/request/pagination-request.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiDocs.upload('앨범 업로드')
  @ApiBearerAuth('jwt')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  upload(@User() user: UserEntity, @UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'you need upload file',
        code: -1,
      });
    }
    return this.albumService.upload(user, image);
  }

  @ApiDocs.getMany('앨범 리스트 조회')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  getMany(@User() user: UserEntity) {
    //TODO: 커서기반 페이지네이션
    return this.albumService.findMany(user);
  }
}
