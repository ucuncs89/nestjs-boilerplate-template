import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPriceEntity } from './project_price.entity';

@Entity('project_price_additional')
export class ProjectPriceAdditionalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_price_id: number;

  @Column({ type: 'varchar', nullable: true })
  additional_name: string;

  @Column({ type: 'double precision', nullable: true })
  additional_price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

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
    () => ProjectPriceEntity,
    (project_price: ProjectPriceEntity) => project_price.additional_price,
    { cascade: true },
  )
  @JoinColumn({ name: 'project_price_id' })
  public project_price: ProjectPriceEntity;
}
