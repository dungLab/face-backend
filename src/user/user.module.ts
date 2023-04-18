import { UserRepository } from '@/user/repositories/user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileModule } from '@/file/file.module';
import { ProfileRepository } from '@/user/repositories/profile.repository';

@Module({
  imports: [FileModule],
  providers: [UserRepository, UserService, ProfileRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
