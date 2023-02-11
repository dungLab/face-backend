import { OAuthServiceType } from '@/main/auth/constants';
import { UserEntity } from '@/main/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return await this.createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', {
        email,
      })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findByEmailAndType(email: string, type: OAuthServiceType) {
    return await this.createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', {
        email,
      })
      .andWhere('user.type = :type', {
        type,
      })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }
}
