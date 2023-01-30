import { UserRepository } from '@/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    // repositories
    private readonly userRepository: UserRepository,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}
