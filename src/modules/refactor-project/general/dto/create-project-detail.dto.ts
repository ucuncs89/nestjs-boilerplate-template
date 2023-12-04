import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum StatusProjectDetailEnum {
  Draft = 'Draft',
  Published = 'Published',
}
export enum TypepProjectDetailEnum {
  Planning = 'Planning',
  Sampling = 'Sampling',
  Production = 'Production',
}

export class CreateProjectDetailDto {
  @ApiProperty({ enum: StatusProjectDetailEnum })
  @IsEnum(StatusProjectDetailEnum)
  @IsNotEmpty()
  status: StatusProjectDetailEnum;

  @ApiProperty({ enum: TypepProjectDetailEnum })
  @IsEnum(TypepProjectDetailEnum)
  @IsNotEmpty()
  type: TypepProjectDetailEnum;

  is_sampling?: boolean;

  is_confirm?: boolean;

  material_source?: string;

  total_price?: number;

  fabric_percentage_of_loss?: number;

  sewing_accessories_percentage_of_loss?: number;

  packaging_accessories_percentage_of_loss?: number;

  finished_goods_percentage_of_loss?: number;

  packaging_instructions?: string;
}
