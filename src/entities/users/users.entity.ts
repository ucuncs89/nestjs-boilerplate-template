import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesEntity } from '../roles/roles.entity';
import { UsersDetailEntity } from './users_detail.entity';
import { ProjectHistoryEntity } from '../project/project_history.entity';
import { PurchaseOrderStatusEntity } from '../purchase-order/purchase_order_status.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { PurchaseOrderEntity } from '../purchase-order/purchase_order.entity';

@Entity('users')
export class UsersEntity {
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

  @Column({ type: 'boolean', default: true })
  need_verification: boolean;

  @Column({ type: 'text', nullable: true })
  path_picture: string;

  @Column({ type: 'text', nullable: true })
  base_path: string;

  @Column({ type: 'boolean', default: false })
  is_forgot_password: boolean;

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

  @OneToMany(
    () => ProjectHistoryEntity,
    (history: ProjectHistoryEntity) => history.users,
  )
  @JoinColumn({ name: 'created_by' })
  history: ProjectHistoryEntity[];

  @OneToMany(
    () => PurchaseOrderStatusEntity,
    (status: PurchaseOrderStatusEntity) => status.users,
  )
  @JoinColumn({ name: 'updated_by' })
  purchase_order_status_approval: PurchaseOrderStatusEntity[];

  @OneToMany(
    () => InvoiceEntity,
    (invoice: InvoiceEntity) => invoice.payment_attempt,
  )
  @JoinColumn({ name: 'status_payment_attempt_user' })
  invoice_payment_attempt: InvoiceEntity[];

  @OneToMany(
    () => PurchaseOrderEntity,
    (purchase_order: PurchaseOrderEntity) => purchase_order.payment_attempt,
  )
  @JoinColumn({ name: 'status_payment_attempt_user' })
  purchase_order_payment_attempt: PurchaseOrderEntity[];
}
