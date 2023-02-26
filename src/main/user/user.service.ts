import { OAuthServiceType } from '@/main/auth/constants';
import { getDateFormat } from '@/common/utils/date.util';
import { UserReseponseDto } from '@/main/user/dtos/response/user-response.dto';
import { UserEntity } from '@/main/user/entities/user.entity';
import { UserRepository } from '@/main/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';

@Injectable()
export class UserService {
  constructor(
    // repositories
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: number) {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findByKakaoEmail(email: string) {
    return await this.userRepository.findByEmailAndType(
      email,
      OAuthServiceType.KAKAO,
    );
  }

  getUserInfo(user: UserEntity): UserReseponseDto {
    return Builder(UserReseponseDto)
      .id(user.id)
      .email(user.email)
      .nickName(user.nickName)
      .createdAt(getDateFormat(user.createdAt))
      .build();
  }
}
