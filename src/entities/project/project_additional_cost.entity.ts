import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_additional_cost')
export class ProjectAdditionalCostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'varchar', nullable: true })
  additional_name: string;

  @Column({ type: 'double precision', nullable: true })
  additional_price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

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
}
