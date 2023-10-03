import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectFabricEntity } from './project_fabric.entity';
import { ProjectAccessoriesPackagingEntity } from './project_accessories_packaging.entity';
import { ProjectAccessoriesSewingEntity } from './project_accessories_sewing.entity';

@Entity('project_material')
export class ProjectMaterialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

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

  @OneToMany(
    () => ProjectFabricEntity,
    (fabric: ProjectFabricEntity) => fabric.project_material,
  )
  @JoinColumn({ name: 'project_material_id' })
  fabric: ProjectFabricEntity[];

  @OneToMany(
    () => ProjectAccessoriesSewingEntity,
    (accessories_sewing: ProjectAccessoriesSewingEntity) =>
      accessories_sewing.project_material,
  )
  @JoinColumn({ name: 'project_material_id' })
  accessories_sewing: ProjectFabricEntity[];

  @OneToMany(
    () => ProjectAccessoriesPackagingEntity,
    (accessories_packaging: ProjectAccessoriesPackagingEntity) =>
      accessories_packaging.project_material,
  )
  @JoinColumn({ name: 'project_material_id' })
  accessories_packaging: ProjectFabricEntity[];
}
