import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { ProjectShippingPackingEntity } from './project_shipping_packing.entity';

@Entity('project_shipping')
export class ProjectShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar' })
  shipping_name: string;

  @Column({ type: 'varchar' })
  shipping_vendor_name: string;

  @Column({ type: 'date' })
  shipping_date: string;

  @Column({ type: 'int', nullable: true })
  shipping_cost?: number;

  @Column({ type: 'varchar' })
  section_type: string;

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

  // @OneToMany(
  //   () => ProjectShippingPackingEntity,
  //   (shipping_packing: ProjectShippingPackingEntity) =>
  //     shipping_packing.shipping,
  // )
  // @JoinColumn({ name: 'project_shipping_id' })
  // packing: ProjectShippingPackingEntity[];
}
