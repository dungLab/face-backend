import { BaseEntity, Column, DeleteDateColumn } from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  // TODO: deleted_at -> now()사용하면 miliseconds까지 들어가는 지 확인
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date | null;
}
