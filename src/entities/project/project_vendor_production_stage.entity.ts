import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_vendor_production_stage')
export class ProjectVendorProductionStageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'int' })
  from_vendor_detail_id: number;

  @Column({ type: 'varchar' })
  from_vendor_detail_name: string;

  @Column({ type: 'varchar', nullable: true })
  from_vendor_activity_name: string;

  @Column({ type: 'int' })
  to_vendor_detail_id: number;

  @Column({ type: 'varchar' })
  to_vendor_detail_name: string;

  @Column({ type: 'varchar', nullable: true })
  to_vendor_activity_name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'int', nullable: true })
  deleted_by: number;

  @Column({ type: 'time with time zone', nullable: true })
  deleted_at: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  quantity_unit: string;

  @Column({ type: 'int', nullable: true })
  retur_id: number;
}
