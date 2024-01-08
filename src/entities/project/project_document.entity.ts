import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('project_document')
export class ProjectDocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

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
    () => ProjectEntity,
    (project: ProjectEntity) => project.project_document,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'project_id' })
  public project: ProjectEntity;
}
