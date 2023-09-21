import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class NotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  from_user_id: number;

  @Column({ type: 'int' })
  to_user_id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean' })
  is_read: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_view: boolean;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updated_at?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: string;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @Column({ type: 'int', nullable: true })
  deleted_by: number;

  @Column({ type: 'varchar', nullable: true })
  from_user_fullname?: string;

  @Column({ type: 'varchar', nullable: true })
  module_type?: string;
}
