import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('test')
  export class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    
    @Column({ type: 'varchar', nullable: false, length: 50 })
    name?: string;

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
  