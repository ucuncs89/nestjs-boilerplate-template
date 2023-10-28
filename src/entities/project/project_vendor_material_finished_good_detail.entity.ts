import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVendorMaterialFabricEntity } from './project_vendor_material_fabric.entity';
import { VendorsEntity } from '../vendors/vendors.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from './project_vendor_material_finished_good.entity';

@Entity('project_vendor_material_finished_good_detail')
export class ProjectVendorMaterialFinishedGoodDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_vendor_material_finished_good_id: number;

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
    () => ProjectVendorMaterialFinishedGoodEntity,
    (vendor_material_finished_good: ProjectVendorMaterialFinishedGoodEntity) =>
      vendor_material_finished_good.detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_vendor_material_finished_good_id' })
  public vendor_material_finished_good: ProjectVendorMaterialFinishedGoodEntity;

  @ManyToOne(
    () => VendorsEntity,
    (vendor: VendorsEntity) => vendor.project_vendor_material_fabric_detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'vendor_id' })
  public vendors: VendorsEntity;
}
