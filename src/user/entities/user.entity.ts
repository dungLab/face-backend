import { OAuthServiceType } from '@/auth/constants';
import { EvaluationEntity } from '@/evaluation/entities/evaluation.entity';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from '@/user/entities/profile.entity';
import { AbstractEntity } from '@/common/abstract-entity';

@Index('idx_email_deleted_at', ['email', 'deletedAt'])
@Index('idx_email_type_deleted_at', ['email', 'type', 'deletedAt'])
@Index('uk_email_type', ['email', 'type'], {
  unique: true,
})
@Entity('users')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: '유저 타입 (kakao, naver, google, apple)',
  })
  type: OAuthServiceType;

  // TODO: refreshToken 고정된 문자열의 길이이면 char(length) 로 변경
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @OneToMany(() => PhotoEntity, (imageEntity) => imageEntity.user)
  photos: PhotoEntity[];

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.user)
  evaluations: EvaluationEntity[];

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;
}
