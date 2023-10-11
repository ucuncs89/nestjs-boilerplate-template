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

  @Column({ type: 'int' })
  activity_id: number;

  @Column({ type: 'varchar' })
  activity_name: string;

  @Column({ type: 'double precision', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  quantity_unit: string;

  @Column({ type: 'double precision', nullable: true })
  price: number;

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
    () => ProjectVendorProductionEntity,
    (vendor_production: ProjectVendorProductionEntity) =>
      vendor_production.vendor_production_detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_vendor_production_id' })
  public vendor_production: ProjectVendorProductionEntity;
}
