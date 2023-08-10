import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FabricVendorColorEntity } from './fabric_vendor_color.entity';
import { VendorsEntity } from '../vendors/vendors.entity';
import { FabricVendorDocumentEntity } from './fabric_vendor_document.entity';

@Entity('fabric_vendor')
export class FabricVendorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'int', nullable: false })
  fabric_id: number;

  @Column({ type: 'int', nullable: false })
  vendor_id: number;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  weight: string;

  @Column({ type: 'varchar', nullable: true })
  width: string;

  @Column({ type: 'varchar', nullable: true })
  minimum_order_quantity: string;

  @Column({ type: 'varchar', nullable: true })
  stock_availability: string;

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
    () => FabricVendorColorEntity,
    (vendor_documents: FabricVendorColorEntity) =>
      vendor_documents.fabric_vendor,
  )
  @JoinColumn({ name: 'fabric_vendor_id' })
  color: FabricVendorColorEntity[];

  @OneToMany(
    () => FabricVendorDocumentEntity,
    (vendor_documents: FabricVendorDocumentEntity) =>
      vendor_documents.fabric_vendor,
  )
  @JoinColumn({ name: 'fabric_vendor_id' })
  files: FabricVendorDocumentEntity[];

  @ManyToOne(
    () => VendorsEntity,
    (vendor: VendorsEntity) => vendor.vendor_fabric,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  public vendor: VendorsEntity;
}
