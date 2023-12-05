import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialEntity } from './project_vendor_material.entity';
import { ProjectVariantFabricColorEntity } from './project_variant_fabric_color.entity';

@Entity('project_material_item')
export class ProjectMaterialItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

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
  consumption: number;

  @Column({ type: 'varchar', nullable: true })
  consumption_unit: string;

  @Column({ type: 'double precision', nullable: true })
  heavy: number;

  @Column({ type: 'varchar', nullable: true })
  heavy_unit: string;

  @Column({ type: 'double precision', nullable: true })
  long: number;

  @Column({ type: 'varchar', nullable: true })
  long_unit: string;

  @Column({ type: 'double precision', nullable: true })
  wide: number;

  @Column({ type: 'varchar', nullable: true })
  wide_unit: string;

  @Column({ type: 'double precision', nullable: true })
  diameter: number;

  @Column({ type: 'varchar', nullable: true })
  diameter_unit: string;

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
    () => ProjectVendorMaterialEntity,
    (vendor_material_material: ProjectVendorMaterialEntity) =>
      vendor_material_material.project_material_item,
  )
  @JoinColumn({ name: 'project_material_item_id' })
  vendor_material: ProjectVendorMaterialEntity[];

  @OneToMany(
    () => ProjectVariantFabricColorEntity,
    (vendor_material_material: ProjectVariantFabricColorEntity) =>
      vendor_material_material.project_material_item,
  )
  @JoinColumn({ name: 'project_fabric_id' })
  project_variant_fabric_color: ProjectVariantFabricColorEntity[];
}
