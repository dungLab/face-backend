import { OAuthServiceType } from '@/auth/constants';
import { UserEntity } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .andWhere('user.deletedAt is null')
      .getOne();
  }

  async findByEmailAndType(email: string, type: OAuthServiceType) {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .andWhere('user.type = :type', {
        type,
      })
      .andWhere('user.deletedAt is null')
      .getOne();
  }
}
