import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectSamplingStatusEntity } from './project_sampling_status.entity';
import { ProjectSamplingRevisiEntity } from './project_sampling_revisi.entity';

@Entity('project_set_sampling')
export class ProjectSetSamplingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  sampling_date?: string;

  @Column({ type: 'int', nullable: true })
  sampling_price?: number;

  @Column({ type: 'boolean', nullable: true })
  is_completed: boolean;

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

  @OneToMany(
    () => ProjectSamplingStatusEntity,
    (project_sampling_status: ProjectSamplingStatusEntity) =>
      project_sampling_status.project_set_sampling,
  )
  @JoinColumn({ name: 'project_set_sampling_id' })
  project_sampling_status: ProjectSamplingStatusEntity[];

  @OneToMany(
    () => ProjectSamplingRevisiEntity,
    (project_sampling_revisi: ProjectSamplingRevisiEntity) =>
      project_sampling_revisi.project_set_sampling,
  )
  @JoinColumn({ name: 'project_set_sampling_id' })
  project_sampling_revisi: ProjectSamplingRevisiEntity[];
}
