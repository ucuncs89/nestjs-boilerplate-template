import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CityEntity } from './city.entity';
import { VillageEntity } from './village.entity';

@Entity('district')
export class DistrictEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'integer' })
  city_id: number;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ManyToOne(() => CityEntity, (city: CityEntity) => city.district, {
    cascade: true,
  })
  @JoinColumn({ name: 'city_id' })
  public city: CityEntity;

  @OneToMany(() => VillageEntity, (village: VillageEntity) => village.district)
  @JoinColumn({ name: 'district_id' })
  village: VillageEntity[];
}
