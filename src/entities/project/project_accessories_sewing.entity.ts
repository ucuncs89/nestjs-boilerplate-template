import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectMaterialEntity } from './project_material.entity';

@Entity('project_accessories_sewing')
export class ProjectAccessoriesSewingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_material_id: number;

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

  @ManyToOne(
    () => ProjectMaterialEntity,
    (project_material: ProjectMaterialEntity) => project_material.fabric,
  )
  @JoinColumn({ name: 'project_material_id' })
  public project_material: ProjectMaterialEntity;
}
