import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrderHistoryEntity } from './purchase_order_history.entity';

@Entity('purchase_order')
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'varchar', nullable: true })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  company_address: string;

  @Column({ type: 'varchar', nullable: true })
  company_phone_number: string;

  @Column({ type: 'double precision', nullable: true })
  ppn: number;

  @Column({ type: 'varchar', nullable: true })
  ppn_unit: string;

  @Column({ type: 'double precision', nullable: true })
  pph: number;

  @Column({ type: 'varchar', nullable: true })
  pph_unit: number;

  @Column({ type: 'double precision', nullable: true })
  discount: number;

  @Column({ type: 'varchar', nullable: true })
  bank_name: string;

  @Column({ type: 'varchar', nullable: true })
  bank_account_number: string;

  @Column({ type: 'varchar', nullable: true, length: '64' })
  bank_account_houlders_name: string;

  @Column({ type: 'varchar', nullable: true })
  payment_term: string;

  @Column({ type: 'varchar', nullable: true })
  payment_term_unit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

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

  @OneToMany(
    () => PurchaseOrderHistoryEntity,
    (history: PurchaseOrderHistoryEntity) => history.purchase_order,
  )
  @JoinColumn({ name: 'purchase_order_id' })
  history: PurchaseOrderHistoryEntity[];
}
