import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { User } from '@/main/auth/user.decorator';
import { UpdateUserDto } from '@/main/user/dtos/request/update-user.dto';
import { UserEntity } from '@/main/user/entities/user.entity';
import { ApiDocs } from '@/main/user/user.docs';
import { UserService } from '@/main/user/user.service';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('face > 유저')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiDocs.getInfo('로그인한 유저 정보 조회')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getInfo(@User() user: UserEntity) {
    return this.userService.getUserInfo(user);
  }

  @ApiDocs.update('유저 정보 수정')
  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@User() user: UserEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }
}
