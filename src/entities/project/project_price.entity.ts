import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPriceAdditionalEntity } from './project_price_additional.entity';

@Entity('project_price')
export class ProjectPriceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_detail_id: number;

  @Column({ type: 'double precision', nullable: true })
  selling_price_per_item: number;

  @Column({ type: 'double precision', nullable: true })
  loss_percentage: number;

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
    () => ProjectPriceAdditionalEntity,
    (fabric_color: ProjectPriceAdditionalEntity) => fabric_color.project_price,
  )
  @JoinColumn({ name: 'project_price_id' })
  additional_price: ProjectPriceAdditionalEntity[];
}
