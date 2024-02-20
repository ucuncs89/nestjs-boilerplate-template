import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchase_order_detail')
export class PurchaseOrderDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  purchase_order_id: number;

  @Column({ type: 'int', nullable: true })
  relation_id: number;

  @Column({ type: 'varchar', nullable: true })
  item: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  unit: string;

  @Column({ type: 'double precision', nullable: true })
  unit_price: number;

  @Column({ type: 'double precision', nullable: true })
  sub_total: number;

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
}
