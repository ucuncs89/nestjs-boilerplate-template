import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseFieldEntity } from '../default/base_field.entity';

@Entity('mail_templates')
export class MailTemplatesEntity extends BaseFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  sources: string;

  @Column({ type: 'varchar', nullable: true, length: '50' })
  variables: string;
}
