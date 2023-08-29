import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { CityEntity } from './city.entity';

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
}
