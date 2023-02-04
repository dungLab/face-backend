import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { ErrorResponse } from '@/common/error-response.exception';
import { PhotoService } from '@/photo/photo.service';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiDocs } from '@/photo/photo.docs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > 포토')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiDocs.upload('포토 업로드')
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
    return this.photoService.upload(user, image);
  }

  @ApiDocs.getMany('포토 리스트 조회')
  @UseGuards(JwtAuthGuard)
  @Get()
  getMany(@User() user: UserEntity) {
    //TODO: 커서기반 페이지네이션
    return this.photoService.findMany(user);
  }

  @ApiDocs.getOne('포토 하나 조회')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@User() user: UserEntity, @Param('id', ParseIntPipe) id: number) {
    return this.photoService.findOne(id);
  }
}
