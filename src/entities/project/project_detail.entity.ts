import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_detail')
export class ProjectDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  type: string;

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

  @Column({ type: 'boolean', nullable: true })
  is_sampling: boolean;

  @Column({ type: 'boolean', nullable: true })
  is_confirm: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  material_source: string;

  @Column({ type: 'double precision', nullable: true })
  total_price: number;

  @Column({ type: 'double precision', nullable: true })
  fabric_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  sewing_accessories_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  packaging_accessories_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  finished_goods_percentage_of_loss: number;

  @Column({ type: 'text', nullable: true })
  packaging_instructions: string;
}
