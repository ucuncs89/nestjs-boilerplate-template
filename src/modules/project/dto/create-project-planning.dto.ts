import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum StatusProjectPlanningEnum {
  Draft = 'Draft',
  Published = 'Published',
}

export class CreateProjectPlanningDto {
  @ApiProperty()
  @IsNotEmpty()
  material_source: string;

  @ApiProperty({ enum: StatusProjectPlanningEnum })
  @IsEnum(StatusProjectPlanningEnum)
  @IsNotEmpty()
  status: StatusProjectPlanningEnum;

  @ApiProperty()
  fabric_percentage_of_loss?: number;

  @ApiProperty()
  sewing_accessories_percentage_of_loss?: number;

  @ApiProperty()
  packaging_accessories_percentage_of_loss?: number;

  @ApiProperty()
  packaging_instructions?: string;
}
