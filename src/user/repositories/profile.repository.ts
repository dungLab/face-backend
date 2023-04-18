import { ProfileEntity } from '@/user/entities/profile.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProfileEntity, dataSource.createEntityManager());
  }

  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('profile', queryRunner)
      : this.createQueryBuilder('profile');
  }
}
