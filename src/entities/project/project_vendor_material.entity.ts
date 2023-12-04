import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialDetailEntity } from './project_vendor_material_detail.entity';
import { ProjectMaterialItemEntity } from './project_material_item.entity';
import { ProjectVariantEntity } from './project_variant.entity';

@Entity('project_vendor_material')
export class ProjectVendorMaterialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'int' })
  project_variant_id: number;

  @Column({ type: 'int' })
  project_material_item_id: number;

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
    () => ProjectVendorMaterialDetailEntity,
    (detail: ProjectVendorMaterialDetailEntity) => detail.vendor_material,
  )
  @JoinColumn({ name: 'project_vendor_material_id' })
  detail: ProjectVendorMaterialDetailEntity[];

  @ManyToOne(
    () => ProjectMaterialItemEntity,
    (project_material_item: ProjectMaterialItemEntity) =>
      project_material_item.vendor_material,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_material_item_id' })
  public project_material_item: ProjectMaterialItemEntity;

  @ManyToOne(
    () => ProjectVariantEntity,
    (project_fabric: ProjectVariantEntity) => project_fabric.vendor_material,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_variant_id' })
  public project_variant: ProjectVariantEntity;
}
