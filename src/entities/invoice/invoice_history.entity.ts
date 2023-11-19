import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_history')
export class InvoiceHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  invoice_id: number;

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
    () => InvoiceEntity,
    (purchase_order: InvoiceEntity) => purchase_order.history,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'invoice_id' })
  public invoice: InvoiceEntity;
}
