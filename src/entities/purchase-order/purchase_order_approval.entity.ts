import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrderEntity } from './purchase_order.entity';

@Entity('purchase_order_approval')
export class PurchaseOrderApprovalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  purchase_order_id: number;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  status_desc: string;

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

  @ManyToOne(
    () => PurchaseOrderEntity,
    (purchase_order: PurchaseOrderEntity) => purchase_order.approval,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'purchase_order_id' })
  public purchase_order: PurchaseOrderEntity;
}
// status : Approved, Rejected
// status_desc : Made by, Sent by the finance team, Approved by
// insert 3 nya saat insert dan statusnya Rejected dulu
