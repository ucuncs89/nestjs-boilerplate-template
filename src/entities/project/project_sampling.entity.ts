import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_sampling')
export class ProjectSamplingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'double precision', nullable: true })
  cost: number;

  @Column({ type: 'double precision', nullable: true })
  total_cost: number;

  @Column({ type: 'varchar' })
  added_in_section: string;

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

  @Column({ type: 'int', nullable: true })
  planning_project_project_sampling_id: number;

  @Column({ type: 'int', nullable: true })
  costing_project_project_sampling_id: number;
}
