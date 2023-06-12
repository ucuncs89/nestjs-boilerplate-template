import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseFieldEntity } from '../default/base_field.entity';

@Entity('roles')
export class RolesEntity extends BaseFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;
}
