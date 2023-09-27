import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_planning_accessories_sewing')
export class ProjectPlanningAccessoriesSewingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_planning_id: number;

  @Column({ type: 'int' })
  accessories_sewing_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'double precision', nullable: true })
  consumption: number;

  @Column({ type: 'varchar', nullable: true })
  consumption_unit: string;

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
