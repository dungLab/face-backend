import { FileType } from '@/file/constants';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '@/user/entities/profile.entity';

@Entity('FILE')
export class FileEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'type', comment: '파일 타입 (image, docs, ..)' })
  type: FileType;

  @Column({ name: 'url', type: 'varchar', comment: 'obj url' })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToOne(() => PhotoEntity, (photo) => photo.file)
  photo: PhotoEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.file)
  profile: ProfileEntity;
}
