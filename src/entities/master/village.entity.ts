import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('village')
export class VillageEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
  district_id: number;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ManyToOne(
    () => DistrictEntity,
    (district: DistrictEntity) => district.village,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'district_id' })
  public district: DistrictEntity;
}
