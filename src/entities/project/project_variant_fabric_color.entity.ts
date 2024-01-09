import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVariantEntity } from './project_variant.entity';

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

  // @ManyToOne(
  //   () => ProjectVariantEntity,
  //   (project_variant: ProjectVariantEntity) => project_variant.project_fabric,
  //   { cascade: true },
  // )
  // @JoinColumn({ name: 'project_variant_id' })
  // public project_variant: ProjectVariantEntity;
}
