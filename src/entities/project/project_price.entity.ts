import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_price')
export class ProjectPriceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'double precision', nullable: true })
  selling_price_per_item: number;

  @Column({ type: 'double precision', nullable: true })
  loss_percentage: number;

  @Column({ type: 'double precision', nullable: true })
  commission: number;

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
}
