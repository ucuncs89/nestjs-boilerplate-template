import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseFieldEntity } from '../default/base_field.entity';

@Entity('notifications')
export class UsersEntity extends BaseFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  from_user_id: number;

  @Column({ type: 'int' })
  to_user_id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean' })
  is_read: boolean;
}
