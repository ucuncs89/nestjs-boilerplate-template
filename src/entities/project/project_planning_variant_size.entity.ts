import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPlanningVariantEntity } from './project_planning_variant.entity';

@Entity('project_planning_variant_size')
export class ProjectPlanningVariantSizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_planning_variant_id: number;

  @Column({ type: 'varchar' })
  size_ratio: string;

  @Column({ type: 'int', nullable: true })
  number_of_item: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  size_unit: string;

  @ManyToOne(
    () => ProjectPlanningVariantEntity,
    (planning_variant: ProjectPlanningVariantEntity) => planning_variant.size,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_planning_variant_id' })
  public planning_variant: ProjectPlanningVariantEntity;
}
