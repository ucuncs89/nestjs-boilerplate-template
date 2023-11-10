import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrderEntity } from './purchase_order.entity';

@Entity('purchase_order_history')
export class PurchaseOrderHistoryEntity {
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
    (purchase_order: PurchaseOrderEntity) => purchase_order.history,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'purchase_order_id' })
  public purchase_order: PurchaseOrderEntity;
}
