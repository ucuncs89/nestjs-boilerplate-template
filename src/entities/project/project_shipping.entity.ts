import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_shipping')
export class ProjectShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'varchar' })
  shipping_name: string;

  @Column({ type: 'varchar' })
  shipping_vendor_name: string;

  @Column({ type: 'timestamp with time zone' })
  shipping_date: string;

  @Column({ type: 'int', nullable: true })
  shipping_cost?: number;

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
}
