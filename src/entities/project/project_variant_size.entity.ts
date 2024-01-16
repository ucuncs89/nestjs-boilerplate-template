import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVariantEntity } from './project_variant.entity';

@Entity('project_variant_size')
export class ProjectVariantSizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_variant_id: number;

  @Column({ type: 'varchar' })
  size_ratio: string;

  @Column({ type: 'int', nullable: true })
  number_of_item: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  size_unit: string;

  @Column({ type: 'int', nullable: true })
  size_id: number;

  @ManyToOne(
    () => ProjectVariantEntity,
    (project_variant: ProjectVariantEntity) =>
      project_variant.project_variant_size,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_variant_id' })
  public project_variant: ProjectVariantEntity;
}
