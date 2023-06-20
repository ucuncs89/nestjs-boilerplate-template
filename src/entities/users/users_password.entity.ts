import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_password')
export class UsersPasswordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;
}
