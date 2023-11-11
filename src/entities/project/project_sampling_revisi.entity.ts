import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectSetSamplingEntity } from './project_set_sampling.entity';

@Entity('project_sampling_revisi')
export class ProjectSamplingRevisiEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_set_sampling_id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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
    () => ProjectSetSamplingEntity,
    (project_set_sampling: ProjectSetSamplingEntity) =>
      project_set_sampling.project_sampling_status,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_set_sampling_id' })
  public project_set_sampling: ProjectSetSamplingEntity;
}
