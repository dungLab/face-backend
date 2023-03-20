import { OAuthServiceType } from '@/main/auth/constants';
import { UserEntity } from '@/main/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('user', queryRunner)
      : this.createQueryBuilder('user');
  }

  async findById(id: number, queryRunner?: QueryRunner) {
    return await this._getBaseQueryBuilder(queryRunner)
      .withDeleted()
      .where('user.id = :id', {
        id,
      })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findByEmail(email: string) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .where('user.email = :email', {
        email,
      })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findByEmailAndType(email: string, type: OAuthServiceType) {
    return await this._getBaseQueryBuilder()
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
