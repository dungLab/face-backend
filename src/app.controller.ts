import { ApiDocs } from '@/app.docs';
import { AppService } from '@/app.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiDocs.healthCheck('healthCheck')
  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @ApiDocs.jwtTest('jwt test')
  @UseGuards(JwtAuthGuard)
  @Get('jwt-test')
  jwtTest(@User() user: UserEntity) {
    return 'success';
  }
}
