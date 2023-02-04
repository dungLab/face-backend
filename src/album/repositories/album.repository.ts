import { AlbumEntity } from '@/album/entities/album.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AlbumRepository extends Repository<AlbumEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AlbumEntity, dataSource.createEntityManager());
  }
}
