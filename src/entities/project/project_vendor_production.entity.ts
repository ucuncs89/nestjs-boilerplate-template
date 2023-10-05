import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_vendor_production')
export class ProjectVendorProductionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'double precision', nullable: true })
  sewing_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  cutting_percentage_of_loss: number;

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
