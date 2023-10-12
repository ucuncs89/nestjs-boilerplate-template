import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialAccessoriesSewingEntity } from './project_vendor_material_accessories_sewing.entity';

@Entity('project_vendor_material_accessories_sewing_detail')
export class ProjectVendorMaterialAccessoriesSewingDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_vendor_material_accessories_sewing_id: number;

  @Column({ type: 'int' })
  vendor_id: number;

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
    () => ProjectVendorMaterialAccessoriesSewingEntity,
    (vendor_material_sewing: ProjectVendorMaterialAccessoriesSewingEntity) =>
      vendor_material_sewing.detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_vendor_material_accessories_sewing_id' })
  public vendor_material_sewing: ProjectVendorMaterialAccessoriesSewingEntity;
}
