import { JwtAuthGuard } from '@/main/auth/jwt-auth.guard';
import { User } from '@/main/auth/user.decorator';
import { UserEntity } from '@/main/user/entities/user.entity';
import { ApiDocs } from '@/main/user/user.docs';
import { UserService } from '@/main/user/user.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
}
