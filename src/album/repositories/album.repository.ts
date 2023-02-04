import { AlbumEntity } from '@/album/entities/album.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AlbumRepository extends Repository<AlbumEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AlbumEntity, dataSource.createEntityManager());
  }

  async findManyCursorByUserId(userId: number) {
    return await this.createQueryBuilder('album')
      .leftJoinAndSelect('album.user', 'user')
      .where('album.userId = :userId', {
        userId,
      })
      .andWhere('album.deletedAt is null')
      .orderBy('album.id', 'DESC')
      .getMany();
  }
}
