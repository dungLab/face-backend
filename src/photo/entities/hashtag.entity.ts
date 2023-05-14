import { AbstractEntity } from '@/common/abstract-entity';
import { PhotoHashTagEntity } from '@/photo/entities/photo-hashtag.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_name', ['name'])
@Index('idx_name_deletedAt', ['name', 'deletedAt'])
@Entity('HASHTAG')
export class HashTagEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', comment: 'name' })
  name: string;

  @OneToMany(() => PhotoHashTagEntity, (photoHashTag) => photoHashTag.hashTag)
  photoHashTags: PhotoHashTagEntity[];
}
