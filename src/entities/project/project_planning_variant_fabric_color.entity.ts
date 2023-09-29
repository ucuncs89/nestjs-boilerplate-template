import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPlanningVariantEntity } from './project_planning_variant.entity';

@Entity('project_planning_variant_fabric_color')
export class ProjectPlanningVariantFabricColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_planning_variant_id: number;

  @Column({ type: 'int', nullable: true })
  color_id: number;

  @Column({ type: 'varchar', nullable: true })
  color_name: string;

  @Column({ type: 'int' })
  project_planning_fabric_id: number;

  @ManyToOne(
    () => ProjectPlanningVariantEntity,
    (planning_variant: ProjectPlanningVariantEntity) =>
      planning_variant.project_fabric,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_planning_variant_id' })
  public planning_variant: ProjectPlanningVariantEntity;
}
