import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialEntity } from './project_vendor_material.entity';

@Entity('project_material_item')
export class ProjectMaterialItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'int' })
  relation_id: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  used_for: string;

  @Column({ type: 'varchar', nullable: true })
  cut_shape: string;

  @Column({ type: 'double precision', nullable: true })
  allowance: number;

  @Column({ type: 'double precision', nullable: true })
  consumption: number;

  @Column({ type: 'varchar', nullable: true })
  consumption_unit: string;

  @Column({ type: 'double precision', nullable: true })
  width: number;

  @Column({ type: 'varchar', nullable: true })
  width_unit: string;

  @Column({ type: 'double precision', nullable: true })
  long: number;

  @Column({ type: 'varchar', nullable: true })
  long_unit: string;

  @Column({ type: 'double precision', nullable: true })
  weight: number;

  @Column({ type: 'varchar', nullable: true })
  weight_unit: string;

  @Column({ type: 'double precision', nullable: true })
  length: number;

  @Column({ type: 'varchar', nullable: true })
  length_unit: string;

  @Column({ type: 'double precision', nullable: true })
  diameter: number;

  @Column({ type: 'varchar', nullable: true })
  diameter_unit: string;

  @Column({ type: 'varchar' })
  added_in_section: string;

  @Column({ type: 'double precision', nullable: true })
  avg_price: number;

  @Column({ type: 'double precision', nullable: true })
  total_price: number;

  @Column({ type: 'int', nullable: true })
  planning_material_item_id: number;

  @Column({ type: 'int', nullable: true })
  costing_material_item_id: number;

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

  @Column({ type: 'varchar', nullable: true })
  status_approval: string;
  @OneToMany(
    () => ProjectVendorMaterialEntity,
    (vendor_material_material: ProjectVendorMaterialEntity) =>
      vendor_material_material.project_material_item,
  )
  @JoinColumn({ name: 'project_material_item_id' })
  vendor_material: ProjectVendorMaterialEntity[];

  @OneToOne(() => ProjectMaterialItemEntity)
  @JoinColumn({ name: 'costing_material_item_id' })
  costing_material_item: ProjectMaterialItemEntity;
}
