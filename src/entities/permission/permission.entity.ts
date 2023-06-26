import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RolesEntity } from '../roles/roles.entity';

@Entity('permissions')
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  parent_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;
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

  @OneToMany(() => PermissionsEntity, (permission) => permission.parent)
  details?: PermissionsEntity[];

  @ManyToOne(() => PermissionsEntity, (permission) => permission.details, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent?: PermissionsEntity;

  @ManyToMany(() => RolesEntity)
  @JoinTable({
    name: 'roles_permission',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RolesEntity[];
}
