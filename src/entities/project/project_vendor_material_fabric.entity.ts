import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialFabricDetailEntity } from './project_vendor_material_fabric_detail.entity';
import { ProjectFabricEntity } from './project_fabric.entity';
import { ProjectVariantEntity } from './project_variant.entity';

@Entity('project_vendor_material_fabric')
export class ProjectVendorMaterialFabricEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'int' })
  project_variant_id: number;

  @Column({ type: 'int' })
  project_fabric_id: number;

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
    () => ProjectVendorMaterialFabricDetailEntity,
    (detail: ProjectVendorMaterialFabricDetailEntity) =>
      detail.vendor_material_fabric,
  )
  @JoinColumn({ name: 'project_vendor_material_fabric_id' })
  detail: ProjectVendorMaterialFabricDetailEntity[];

  @ManyToOne(
    () => ProjectFabricEntity,
    (project_fabric: ProjectFabricEntity) => project_fabric.vendor_material,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_fabric_id' })
  public project_fabric: ProjectFabricEntity;

  @ManyToOne(
    () => ProjectVariantEntity,
    (project_fabric: ProjectVariantEntity) =>
      project_fabric.vendor_material_fabric,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_variant_id' })
  public project_variant: ProjectVariantEntity;
}
