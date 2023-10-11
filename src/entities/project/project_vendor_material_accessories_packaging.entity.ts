import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from './project_vendor_material_accessories_packaging_detail.entity';

@Entity('project_vendor_material_accessories_packaging')
export class ProjectVendorMaterialAccessoriesPackagingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'int' })
  project_variant_id: number;

  @Column({ type: 'int' })
  project_accessories_packaging_id: number;

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
    () => ProjectVendorMaterialAccessoriesPackagingDetailEntity,
    (detail: ProjectVendorMaterialAccessoriesPackagingDetailEntity) =>
      detail.vendor_material_packaging,
  )
  @JoinColumn({ name: 'project_vendor_material_accessories_packaging_id' })
  detail: ProjectVendorMaterialAccessoriesPackagingDetailEntity[];
}
