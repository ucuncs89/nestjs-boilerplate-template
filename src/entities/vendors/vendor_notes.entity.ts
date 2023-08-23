import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vendor_notes')
export class VendorNotesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  vendor_id: number;

  @Column({ type: 'text' })
  notes: string;

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
