import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FabricVendorEntity } from './fabric_vendor.entity';

@Entity('fabric_vendor_color')
export class FabricVendorColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  fabric_vendor_id: number;

  @Column({ type: 'varchar' })
  color_name: string;

  @Column({ type: 'varchar', length: 50 })
  color_code: string;

  @ManyToOne(
    () => FabricVendorEntity,
    (fabric_vendor: FabricVendorEntity) => fabric_vendor.color,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'fabric_vendor_id' })
  public fabric_vendor: FabricVendorEntity;
}
