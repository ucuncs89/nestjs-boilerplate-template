import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('project_detail_calculate')
export class UsersRolesEntity {
  @PrimaryColumn({ type: 'int' })
  project_id: number;

  @PrimaryColumn({ type: 'varchar' })
  type: string;

  @Column({ type: 'double precision', default: 0, nullable: true })
  total_price: number;

  @Column({ type: 'double precision', default: 0, nullable: true })
  avg_price: number;

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
