import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { User } from '@/main/auth/user.decorator';
import { PhotoService } from '@/main/photo/photo.service';
import { UserEntity } from '@/main/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiDocs } from '@/main/photo/photo.docs';
import { ApiTags } from '@nestjs/swagger';
import { PhotoRequestDto } from '@/main/photo/dtos/request/photo-request.dto';

@ApiTags('face > 포토')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiDocs.create('포토 생성')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() user: UserEntity, @Body() photoRequestDto: PhotoRequestDto) {
    return this.photoService.create(user, photoRequestDto);
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
