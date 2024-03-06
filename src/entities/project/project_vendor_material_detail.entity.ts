import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from '../vendors/vendors.entity';
import { ProjectVendorMaterialEntity } from './project_vendor_material.entity';

@Entity('project_vendor_material_detail')
export class ProjectVendorMaterialDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_vendor_material_id: number;

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

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  status_purchase_order: string;

  @Column({ type: 'int', nullable: true })
  purchase_order_detail_id: number;

  @Column({ type: 'int', nullable: true })
  purchase_order_id: number;

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
    () => ProjectVendorMaterialEntity,
    (vendor_material: ProjectVendorMaterialEntity) => vendor_material.detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_vendor_material_id' })
  public vendor_material: ProjectVendorMaterialEntity;

  @ManyToOne(
    () => VendorsEntity,
    (vendor: VendorsEntity) => vendor.project_vendor_material_detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'vendor_id' })
  public vendors: VendorsEntity;
}
