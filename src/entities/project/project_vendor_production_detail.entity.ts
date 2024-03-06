import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorProductionEntity } from './project_vendor_production.entity';

@Entity('project_vendor_production_detail')
export class ProjectVendorProductionDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_vendor_production_id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'varchar' })
  vendor_name: string;

  @Column({ type: 'double precision', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  quantity_unit: string;

  @Column({ type: 'double precision', nullable: true })
  price: number;

  @Column({ type: 'double precision', nullable: true })
  total_price: number;

  @Column({ type: 'varchar', nullable: true })
  price_unit: string;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

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

  @Column({ type: 'boolean', nullable: true })
  production_is_completed: boolean;

  @Column({ type: 'varchar', nullable: true })
  added_in_section: string;

  @Column({ type: 'varchar', nullable: true })
  status_purchase_order: string;

  @Column({ type: 'int', nullable: true })
  purchase_order_detail_id: number;

  @Column({ type: 'int', nullable: true })
  purchase_order_id: number;

  @ManyToOne(
    () => ProjectVendorProductionEntity,
    (vendor_production: ProjectVendorProductionEntity) =>
      vendor_production.vendor_production_detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_vendor_production_id' })
  public vendor_production: ProjectVendorProductionEntity;
}
