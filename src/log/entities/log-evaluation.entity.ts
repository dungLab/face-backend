import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LOG-EVALUATION')
export class LogEvaluationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
    comment: '평가한 유저 아이디',
  })
  userId: number;

  @Column({
    name: 'photo_id',
    type: 'int',
    unsigned: true,
    comment: '포토 아이디',
  })
  photoId: number;

  @Column({
    name: 'is_good',
    type: 'boolean',
    unsigned: true,
    nullable: true,
    comment: '좋아요 여부',
  })
  isGood?: boolean | null;

  @Column({
    name: 'is_get',
    type: 'boolean',
    unsigned: true,
    comment: '조회 받음 여부',
  })
  isGet: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
