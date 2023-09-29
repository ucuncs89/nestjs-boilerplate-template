import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPlanningVariantSizeEntity } from './project_planning_variant_size.entity';
import { ProjectPlanningVariantFabricColorEntity } from './project_planning_variant_fabric_color.entity';

@Entity('project_planning_variant')
export class ProjectPlanningVariantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_planning_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', nullable: true })
  total_item: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  item_unit: string;

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
    () => ProjectPlanningVariantSizeEntity,
    (variant_size: ProjectPlanningVariantSizeEntity) =>
      variant_size.planning_variant,
  )
  @JoinColumn({ name: 'project_planning_variant_id' })
  size: ProjectPlanningVariantSizeEntity[];

  @OneToMany(
    () => ProjectPlanningVariantFabricColorEntity,
    (fabric_color: ProjectPlanningVariantFabricColorEntity) =>
      fabric_color.planning_variant,
  )
  @JoinColumn({ name: 'project_planning_variant_id' })
  project_fabric: ProjectPlanningVariantSizeEntity[];
}
