import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_otp')
export class UsersOtpEntity {
  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar' })
  otp?: string;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;
}
