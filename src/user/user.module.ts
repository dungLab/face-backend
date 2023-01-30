import { UserRepository } from '@/user/repositories/user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
