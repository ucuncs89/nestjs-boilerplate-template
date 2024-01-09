import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectVariantSizeEntity } from './project_variant_size.entity';
import { ProjectVariantFabricColorEntity } from './project_variant_fabric_color.entity';
import { ProjectEntity } from './project.entity';
// import { ProjectVendorMaterialEntity } from './project_vendor_material.entity';

@Entity('project_variant')
export class ProjectVariantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

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
    () => ProjectVariantSizeEntity,
    (variant_size: ProjectVariantSizeEntity) => variant_size.project_variant,
  )
  @JoinColumn({ name: 'project_variant_id' })
  project_variant_size: ProjectVariantSizeEntity[];

  // @OneToMany(
  //   () => ProjectVariantFabricColorEntity,
  //   (fabric_color: ProjectVariantFabricColorEntity) =>
  //     fabric_color.project_variant,
  // )
  // @JoinColumn({ name: 'project_variant_id' })
  // project_fabric: ProjectVariantFabricColorEntity[];

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.variant, {
    cascade: true,
  })
  @JoinColumn({ name: 'project_id' })
  public project: ProjectEntity;

  // @OneToMany(
  //   () => ProjectVendorMaterialEntity,
  //   (vendor_material: ProjectVendorMaterialEntity) =>
  //     vendor_material.project_variant,
  // )
  // @JoinColumn({ name: 'project_variant_id' })
  // vendor_material: ProjectVendorMaterialEntity[];
}
