import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectMaterialEntity } from './project_material.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from './project_vendor_material_accessories_packaging.entity';

@Entity('project_accessories_packaging')
export class ProjectAccessoriesPackagingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_material_id: number;

  @Column({ type: 'int' })
  accessories_packaging_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'double precision', nullable: true })
  consumption: number;

  @Column({ type: 'varchar', nullable: true })
  consumption_unit: string;

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
    () => ProjectMaterialEntity,
    (project_material: ProjectMaterialEntity) => project_material.fabric,
  )
  @JoinColumn({ name: 'project_material_id' })
  public project_material: ProjectMaterialEntity;

  @OneToMany(
    () => ProjectVendorMaterialAccessoriesPackagingEntity,
    (packaging_material: ProjectVendorMaterialAccessoriesPackagingEntity) =>
      packaging_material.project_accessories_packaging,
  )
  @JoinColumn({ name: 'project_accessories_packaging_id' })
  vendor_material: ProjectVendorMaterialAccessoriesPackagingEntity[];
}
