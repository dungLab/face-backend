import { UserRepository } from '@/main/user/repositories/user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileModule } from '@/sub/file/file.module';

@Module({
  imports: [FileModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
