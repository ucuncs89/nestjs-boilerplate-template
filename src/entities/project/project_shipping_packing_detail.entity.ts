import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectShippingPackingEntity } from './project_shipping_packing.entity';

@Entity('project_shipping_packing_detail')
export class ProjectShippingPackingDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_shipping_packing_id: number;

  @Column({ type: 'varchar' })
  size_ratio: string;

  @Column({ type: 'int', default: 0 })
  number_of_item: number;

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
    () => ProjectShippingPackingEntity,
    (packing: ProjectShippingPackingEntity) => packing.detail,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_shipping_packing_id' })
  public packing: ProjectShippingPackingEntity;
}
