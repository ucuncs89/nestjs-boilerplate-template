import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseFieldEntity } from '../default/base_field.entity';
import { RolesEntity } from '../roles/roles.entity';
import { UsersDetailEntity } from './users_detail.entity';

@Entity('users')
export class UsersEntity extends BaseFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @ManyToMany(() => RolesEntity)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RolesEntity[];

  @OneToOne(() => UsersDetailEntity)
  @JoinTable({
    name: 'user_id',
  })
  user_detail: UsersEntity;
}
