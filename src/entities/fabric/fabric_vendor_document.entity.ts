import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FabricVendorEntity } from './fabric_vendor.entity';

@Entity('fabric_vendor_document')
export class FabricVendorDocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  fabric_vendor_id: number;

  @Column({ type: 'text' })
  base_url: string;

  @Column({ type: 'text' })
  file_url: string;

  @ManyToOne(
    () => FabricVendorEntity,
    (fabric_vendor: FabricVendorEntity) => fabric_vendor.files,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'fabric_vendor_id' })
  public fabric_vendor: FabricVendorEntity;
}
