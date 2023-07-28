import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerDocumentsEntity } from './customer_documents.entity';

@Entity('customers')
export class CustomersEntity {
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
    () => CustomerDocumentsEntity,
    (customer_documents: CustomerDocumentsEntity) =>
      customer_documents.customer,
  )
  @JoinColumn({ name: 'customer_id' })
  customer_documents: CustomerDocumentsEntity[];
}
