import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceHistoryEntity } from './invoice_history.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity('invoice')
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  project_id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'varchar', nullable: true })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  company_address: string;

  @Column({ type: 'varchar', nullable: true })
  company_phone_number: string;

  @Column({ type: 'double precision', nullable: true })
  ppn: number;

  @Column({ type: 'varchar', nullable: true })
  ppn_unit: string;

  @Column({ type: 'double precision', nullable: true })
  pph: number;

  @Column({ type: 'varchar', nullable: true })
  pph_unit: number;

  @Column({ type: 'double precision', nullable: true })
  discount: number;

  @Column({ type: 'varchar', nullable: true })
  bank_name: string;

  @Column({ type: 'varchar', nullable: true })
  bank_account_number: string;

  @Column({ type: 'varchar', nullable: true, length: '64' })
  bank_account_houlders_name: string;

  @Column({ type: 'varchar', nullable: true })
  payment_term: string;

  @Column({ type: 'varchar', nullable: true })
  payment_term_unit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'int', nullable: true })
  retur_id: number;

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
  delivery_date: string;

  @Column({ type: 'double precision', nullable: true })
  grand_total: number;

  @OneToMany(
    () => InvoiceHistoryEntity,
    (history: InvoiceHistoryEntity) => history.invoice,
  )
  @JoinColumn({ name: 'invoice_id' })
  history: InvoiceHistoryEntity[];

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.invoice)
  @JoinColumn({ name: 'project_id' })
  public project: ProjectEntity;
}
