import { Column, Entity, JoinTable, OneToOne, PrimaryColumn } from 'typeorm';
import { RolesEntity } from './roles.entity';
import { PermissionsEntity } from '../permission/permission.entity';

@Entity('roles_permission')
export class UsersRolesEntity {
  @PrimaryColumn({ type: 'int' })
  role_id: number;

  @PrimaryColumn({ type: 'int' })
  permission_id: number;

  @Column({
    type: 'timestamp with time zone',
    default: 'NOW()',
  })
  created_at: string;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @OneToOne(() => RolesEntity)
  @JoinTable()
  role: RolesEntity;

  @OneToOne(() => PermissionsEntity)
  @JoinTable()
  permission: PermissionsEntity;
}
