import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { DistrictEntity } from './district.entity';
import { CustomersEntity } from '../customers/customers.entity';
import { VendorsEntity } from '../vendors/vendors.entity';

@Entity('city')
export class CityEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'integer' })
  province_id: number;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ManyToOne(
    () => ProvinceEntity,
    (province: ProvinceEntity) => province.city,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'province_id' })
  public province: ProvinceEntity;

  @OneToMany(() => DistrictEntity, (district: DistrictEntity) => district.city)
  @JoinColumn({ name: 'city_id' })
  district: DistrictEntity[];

  @OneToMany(
    () => CustomersEntity,
    (customer: CustomersEntity) => customer.city,
  )
  @JoinColumn({ name: 'city_id' })
  customer: CustomersEntity[];

  @OneToMany(() => VendorsEntity, (vendor: VendorsEntity) => vendor.city)
  @JoinColumn({ name: 'city_id' })
  vendor: CustomersEntity[];
}
