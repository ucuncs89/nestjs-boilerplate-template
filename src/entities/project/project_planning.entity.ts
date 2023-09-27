import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('project_planning')
export class ProjectPlanningEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar', length: 50 })
  material_source: string;

  @Column({ type: 'double precision', nullable: true })
  total_price: number;

  @Column({ type: 'double precision', nullable: true })
  fabric_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  sewing_accessories_percentage_of_loss: number;

  @Column({ type: 'double precision', nullable: true })
  packaging_accessories_percentage_of_loss: number;

  @Column({ type: 'text', nullable: true })
  packaging_instructions: string;

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
