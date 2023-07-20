import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity('vendor_documents')
export class VendorDocumentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text', nullable: true })
  base_url: string;

  @Column({ type: 'text', nullable: true })
  file_url: string;

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
    () => VendorsEntity,
    (vendor: VendorsEntity) => vendor.vendor_documents,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  public vendor: VendorsEntity;
}
