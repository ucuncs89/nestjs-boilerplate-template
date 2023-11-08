import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_purchase_order')
export class ProjectPurchaseOrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'int' })
  purchase_order_id: number;

  @Column({ type: 'varchar' })
  vendor_type: string;

  @Column({ type: 'varchar', nullable: true })
  material_type: string;

  @Column({ type: 'int' })
  relation_id: number;

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
