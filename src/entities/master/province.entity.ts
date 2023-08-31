import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { CityEntity } from './city.entity';
import { CustomersEntity } from '../customers/customers.entity';
import { VendorsEntity } from '../vendors/vendors.entity';

@Entity('province')
export class ProvinceEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @OneToMany(() => CityEntity, (city: CityEntity) => city.province)
  @JoinColumn({ name: 'province_id' })
  city: CityEntity[];

  @OneToMany(
    () => CustomersEntity,
    (customer: CustomersEntity) => customer.province,
  )
  @JoinColumn({ name: 'province_id' })
  customer: CustomersEntity[];

  @OneToMany(() => VendorsEntity, (vendor: VendorsEntity) => vendor.province)
  @JoinColumn({ name: 'province_id' })
  vendor: CustomersEntity[];
}
