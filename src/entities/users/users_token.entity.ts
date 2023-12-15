import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_token')
export class UsersTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'text' })
  token: string;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;
}
