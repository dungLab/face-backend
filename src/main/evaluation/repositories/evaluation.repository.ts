import { EvaluationEntity } from '@/main/evaluation/entities/evaluation.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class EvaluationRepository extends Repository<EvaluationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EvaluationEntity, dataSource.createEntityManager());
  }

  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('evaluation', queryRunner)
      : this.createQueryBuilder('evaluation');
  }

  async findOneByUserIdAndPhotoId(userId: number, photoId: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .select('evaluation.id')
      .where('evaluation.userId = :userId', {
        userId,
      })
      .andWhere('evaluation.photoId = :photoId', {
        photoId,
      })
      .andWhere('evaluation.deletedAt IS NULL')
      .limit(1)
      .getOne();
  }

  async findManyByPhotoId(photoId: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .where('evaluation.photoId = :photoId', {
        photoId,
      })
      .andWhere('evaluation.deletedAt IS NULL')
      .getMany();
  }
}
