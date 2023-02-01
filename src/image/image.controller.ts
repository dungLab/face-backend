import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { ImageService } from '@/image/image.service';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  uploadImage(
    @User() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.imageService.uploadImage(image);
  }
}
