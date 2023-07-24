import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('error_log', { schema: 'logging' })
export class ErrorLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  token?: string;

  @Column({ type: 'text', nullable: true })
  path?: string;

  @Column({ type: 'text', nullable: true })
  payload?: string;

  @Column({ type: 'text', nullable: true })
  query?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'int', nullable: true })
  status_code?: number;

  @Column({ type: 'text', nullable: true })
  error_code?: string;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;
}
