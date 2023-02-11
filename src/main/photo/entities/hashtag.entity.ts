import { PhotoHashTagEntity } from '@/main/photo/entities/photo-hashtag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('idx_name', ['name'])
@Index('idx_name_deletedAt', ['name', 'deletedAt'])
@Entity('HASHTAG')
export class HashTagEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', comment: 'name' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => PhotoHashTagEntity, (photoHashTag) => photoHashTag.hashTag)
  photoHashTags: PhotoHashTagEntity[];
}
