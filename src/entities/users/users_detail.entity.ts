import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_detail')
export class UsersDetailEntity {
  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  login_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  logout_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expired_token: string;

  @Column({ type: 'int', nullable: true })
  password_rate_limiter: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  suspend_at: string;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updated_at?: string;
}
