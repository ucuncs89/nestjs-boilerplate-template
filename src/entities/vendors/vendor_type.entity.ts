import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity('vendor_type')
export class VendorTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(
    () => VendorsEntity,
    (vendor: VendorsEntity) => vendor.vendor_type,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  public vendor: VendorsEntity;
}
