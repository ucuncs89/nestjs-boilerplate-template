import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomersEntity } from './customers.entity';

@Entity('customer_documents')
export class CustomerDocumentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  customer_id: number;

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
    () => CustomersEntity,
    (customer: CustomersEntity) => customer.customer_documents,
    { cascade: true },
  )
  @JoinColumn()
  public customer: CustomersEntity;
}
