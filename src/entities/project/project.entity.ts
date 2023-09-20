import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectDocumentEntity } from './project_document.entity';
import { ProjectSizeEntity } from './project_size.entity';
import { UsersEntity } from '../users/users.entity';
import { DepartmentsEntity } from '../departments/departments.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { CustomersEntity } from '../customers/customers.entity';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  style_name: string;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'timestamp with time zone' })
  deadline: string;

  @Column({ type: 'varchar' })
  order_type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  department_id: number;

  @Column({ type: 'int', nullable: true })
  category_id: number;

  @Column({ type: 'int', nullable: true })
  sub_category_id: number;

  @Column({ type: 'varchar', nullable: true })
  company: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'double precision', nullable: true })
  target_price_for_customer: number;

  @Column({ type: 'varchar', nullable: true })
  status: string;

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

  @OneToMany(
    () => ProjectDocumentEntity,
    (project_document: ProjectDocumentEntity) => project_document.project,
  )
  @JoinColumn({ name: 'project_id' })
  project_document: ProjectDocumentEntity[];

  @OneToMany(
    () => ProjectSizeEntity,
    (project_size: ProjectSizeEntity) => project_size.project,
  )
  @JoinColumn({ name: 'project_id' })
  size: ProjectSizeEntity[];

  @ManyToOne(() => UsersEntity, (users: UsersEntity) => users.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  public users: UsersEntity;

  @ManyToOne(
    () => DepartmentsEntity,
    (departements: DepartmentsEntity) => departements.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'department_id' })
  public departements: DepartmentsEntity;

  @ManyToOne(
    () => CategoriesEntity,
    (categories: CategoriesEntity) => categories.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'category_id' })
  public categories: CategoriesEntity;

  @ManyToOne(
    () => CustomersEntity,
    (customers: CustomersEntity) => customers.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'customer_id' })
  public customers: CustomersEntity;

  @ManyToOne(
    () => CategoriesEntity,
    (categories: CategoriesEntity) => categories.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'sub_category_id' })
  public sub_category: CategoriesEntity;
}
