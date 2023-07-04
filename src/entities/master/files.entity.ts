import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  original_name: string;

  @Column({ type: 'text', nullable: true })
  mimetype: string;

  @Column({ type: 'text', nullable: true })
  base_url: string;

  @Column({ type: 'text', nullable: true })
  file_name: string;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column({ type: 'int', nullable: true })
  size: number;

  @Column({ type: 'int', nullable: true })
  actual_size: number;

  @Column({ type: 'text', nullable: true })
  hash: string;

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
