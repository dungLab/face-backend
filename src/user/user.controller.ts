import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { ApiDocs } from '@/user/user.docs';
import { UserService } from '@/user/user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
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
