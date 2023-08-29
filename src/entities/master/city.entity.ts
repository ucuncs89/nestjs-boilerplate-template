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

@Entity('city')
export class CityEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
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
}
