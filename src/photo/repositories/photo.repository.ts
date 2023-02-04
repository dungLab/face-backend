import { PhotoEntity } from '@/photo/entities/photo.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PhotoRepository extends Repository<PhotoEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PhotoEntity, dataSource.createEntityManager());
  }

  async findManyCursorByUserId(userId: number) {
    return await this.createQueryBuilder('photo')
      .leftJoinAndSelect('photo.user', 'user')
      .where('photo.userId = :userId', {
        userId,
      })
      .andWhere('photo.deletedAt is null')
      .orderBy('photo.id', 'DESC')
      .getMany();
  }
}
