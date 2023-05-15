import { FileType } from '@/file/constants';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from '@/user/entities/profile.entity';
import { FileMetaEntity } from '@/file/entities/file-meta.entity';
import { AbstractEntity } from '@/common/abstract-entity';

@Entity('files')
export class FileEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'type', comment: '파일 타입 (image, docs, ..)' })
  type: FileType;

  @OneToOne(() => PhotoEntity, (photo) => photo.file)
  photo: PhotoEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.file)
  profile: ProfileEntity;

  @OneToMany(() => FileMetaEntity, (meta) => meta.file)
  metas: FileMetaEntity[];
}
