import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ErrorResponse } from '@/common/error-response.exception';
import { imageFileFilter } from '@/common/interceptors/image-file.interceptor';
import { FolderType } from '@/file/constants';
import { ApiDocs } from '@/file/file.docs';
import { FileService } from '@/file/file.service';
import {
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > 파일')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiDocs.uploadImage('이미지 한개 업로드')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
    }),
  )
  @Post('image/:type')
  uploadImage(
    @Param('type') folderType: FolderType,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: 'you need upload file',
        code: -1,
      });
    }

    return this.fileService.uploadImage(folderType, image);
  }
}
