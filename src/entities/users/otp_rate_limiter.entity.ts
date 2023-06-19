import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('otp_rate_limiter')
export class OtpRateLimiterEntity {
  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column({ type: 'int', nullable: true })
  count?: number;

  @Column({ type: 'varchar', nullable: true })
  type?: string;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updated_at?: string;
}
