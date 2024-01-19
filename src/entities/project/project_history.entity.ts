import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UsersEntity } from '../users/users.entity';

@Entity('project_history')
export class ProjectHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar' })
  status: string;

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
    (project: ProjectEntity) => project.project_history,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'project_id' })
  public project: ProjectEntity;

  @ManyToOne(() => UsersEntity, (users: UsersEntity) => users.history, {
    cascade: true,
  })
  @JoinColumn({ name: 'created_by' })
  public users: UsersEntity;
}
