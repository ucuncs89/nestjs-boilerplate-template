import { Column, Entity, JoinTable, OneToOne, PrimaryColumn } from 'typeorm';
import { RolesEntity } from '../roles/roles.entity';
import { UsersEntity } from './users.entity';

@Entity('user_roles')
export class UsersRolesEntity {
  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @PrimaryColumn({ type: 'int' })
  role_id: number;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;

  @OneToOne(() => UsersEntity)
  @JoinTable()
  user: UsersEntity;

  @OneToOne(() => RolesEntity)
  @JoinTable()
  role: RolesEntity;
}
