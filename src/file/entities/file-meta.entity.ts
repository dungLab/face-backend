import { FileEntity } from '@/file/entities/file.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FILE_META')
export class FileMetaEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'file_id',
    type: 'int',
    unsigned: true,
    comment: 'file id',
  })
  fileId: number;

  @Column({ name: 'key', type: 'varchar' })
  key: string;

  @Column({ name: 'value', type: 'varchar' })
  value: string;

  @ManyToOne(() => FileEntity, (file) => file.metas)
  @JoinColumn({
    name: 'file_id',
    referencedColumnName: 'id',
  })
  file: FileEntity;
}
