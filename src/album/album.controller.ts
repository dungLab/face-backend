import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { ErrorResponse } from '@/common/error-response.exception';
import { AlbumService } from '@/album/album.service';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('album')
export class AlbumController {
  constructor(private readonly imageService: AlbumService) {}

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
  uploadImage(
    @User() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'you need upload file',
        code: -1,
      });
    }
    return this.imageService.upload(image);
  }
}
