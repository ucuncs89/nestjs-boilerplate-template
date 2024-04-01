import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accessories_packaging')
export class AccessoriesPackagingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column('text', { array: true })
  category: string[];

  @Column('text', { array: true, nullable: true })
  unit_of_measure: string[];

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
