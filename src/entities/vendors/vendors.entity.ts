import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorDocumentsEntity } from './vendor_documents.entity';
import { VendorTypeEntity } from './vendor_type.entity';
import { FabricVendorEntity } from '../fabric/fabric_vendor.entity';
import { ProvinceEntity } from '../master/province.entity';
import { CityEntity } from '../master/city.entity';
import { ProjectVendorMaterialFabricDetailEntity } from '../project/project_vendor_material_fabric_detail.entity';

@Entity('vendors')
export class VendorsEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  company_phone_number: string;

  @Column({ type: 'text', nullable: true })
  company_address: string;

  @Column({ type: 'varchar', nullable: true })
  taxable: string;

  @Column({ type: 'varchar', nullable: true })
  pic_full_name: string;

  @Column({ type: 'varchar', nullable: true })
  pic_id_number: string;

  @Column({ type: 'varchar', nullable: true })
  pic_phone_number: string;

  @Column({ type: 'varchar', nullable: true })
  pic_email: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true, length: '50' })
  npwp_number: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  bank_name: string;

  @Column({ type: 'varchar', nullable: true })
  bank_account_number: string;

  @Column({ type: 'varchar', nullable: true })
  bank_account_holder_name: string;

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

  @Column({ type: 'timestamp with time zone', nullable: true })
  last_order?: string;

  @OneToMany(
    () => VendorDocumentsEntity,
    (vendor_documents: VendorDocumentsEntity) => vendor_documents.vendor,
  )
  @JoinColumn({ name: 'vendor_id' })
  vendor_documents: VendorDocumentsEntity[];

  @OneToMany(
    () => VendorTypeEntity,
    (vendor_type: VendorTypeEntity) => vendor_type.vendor,
  )
  @JoinColumn({ name: 'vendor_id' })
  vendor_type: VendorTypeEntity[];

  @OneToMany(
    () => FabricVendorEntity,
    (vendor_fabric: FabricVendorEntity) => vendor_fabric.vendor,
  )
  @JoinColumn({ name: 'vendor_id' })
  vendor_fabric: FabricVendorEntity[];

  @Column({ type: 'integer', nullable: true })
  city_id?: number;

  @Column({ type: 'integer', nullable: true })
  province_id?: number;

  @ManyToOne(
    () => ProvinceEntity,
    (province: ProvinceEntity) => province.vendor,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'province_id' })
  public province: ProvinceEntity;

  @ManyToOne(() => CityEntity, (city: CityEntity) => city.vendor, {
    cascade: true,
  })
  @JoinColumn({ name: 'city_id' })
  public city: CityEntity;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_active: boolean;

  @OneToMany(
    () => ProjectVendorMaterialFabricDetailEntity,
    (fabric_detail: ProjectVendorMaterialFabricDetailEntity) =>
      fabric_detail.vendors,
  )
  @JoinColumn({ name: 'vendor_id' })
  project_vendor_material_fabric_detail: ProjectVendorMaterialFabricDetailEntity[];
}
