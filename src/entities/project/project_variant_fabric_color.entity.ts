import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVariantEntity } from './project_variant.entity';
import { ProjectMaterialItemEntity } from './project_material_item.entity';

@Entity('project_variant_fabric_color')
export class ProjectVariantFabricColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_variant_id: number;

  @Column({ type: 'int', nullable: true })
  color_id: number;

  @Column({ type: 'varchar', nullable: true })
  color_name: string;

  @Column({ type: 'int' })
  project_fabric_id: number;

  @ManyToOne(
    () => ProjectVariantEntity,
    (project_variant: ProjectVariantEntity) => project_variant.project_fabric,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_variant_id' })
  public project_variant: ProjectVariantEntity;

  @ManyToOne(
    () => ProjectMaterialItemEntity,
    (project_variant: ProjectMaterialItemEntity) =>
      project_variant.project_variant_fabric_color,
  )
  @JoinColumn({ name: 'project_fabric_id' })
  public project_material_item: ProjectMaterialItemEntity;
}
