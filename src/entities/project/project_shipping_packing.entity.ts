import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectShippingEntity } from './project_shipping.entity';
import { ProjectShippingPackingDetailEntity } from './project_shipping_packing_detail.entity';

@Entity('project_shipping_packing')
export class ProjectShippingPackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_shipping_id: number;

  @Column({ type: 'varchar' })
  variant_name: string;

  @Column({ type: 'int' })
  variant_id: number;

  @Column({ type: 'int', nullable: true })
  total_item?: number;

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
    () => ProjectShippingEntity,
    (shipping: ProjectShippingEntity) => shipping.packing,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_shipping_id' })
  public shipping: ProjectShippingEntity;

  @OneToMany(
    () => ProjectShippingPackingDetailEntity,
    (detail: ProjectShippingPackingDetailEntity) => detail.packing,
  )
  @JoinColumn({ name: 'project_shipping_packing_id' })
  detail: ProjectShippingPackingDetailEntity[];
}
