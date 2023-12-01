import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';

export enum TypeProjectDocumentsEnum {
  FILE = 'FILE',
  LINK = 'LINK',
}
export class ProjectSizeDto {
  @ApiProperty()
  size_ratio: string;

  @ApiProperty()
  number_of_item: number;

  project_id?: number;
}
export class ProjectDocumentsDto {
  @ApiProperty({ enum: TypeProjectDocumentsEnum })
  @IsEnum(TypeProjectDocumentsEnum)
  type: TypeProjectDocumentsEnum;

  @ApiProperty()
  base_url: string;

  @ApiProperty()
  file_url: string;

  project_id?: number;
}

export enum OrderTypeProjectEnum {
  FOB = 'FOB',
  CMT = 'CMT',
  FABRIC = 'FABRIC',
}
export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  style_name: string;

  @ApiProperty()
  @IsNotEmpty()
  customer_id: number;

  @ApiProperty()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({ enum: OrderTypeProjectEnum })
  @IsEnum(OrderTypeProjectEnum)
  @IsNotEmpty()
  order_type: OrderTypeProjectEnum;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  target_price_for_buyer: number;

  @ApiProperty()
  @IsNotEmpty()
  departement_id: number;

  @ApiProperty()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty()
  @IsNotEmpty()
  sub_category_id: number;

  @ApiProperty({
    isArray: true,
    type: ProjectDocumentsDto,
  })
  @ApiProperty()
  project_document?: ProjectDocumentsDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectSizeDto,
  })
  @ApiProperty()
  size?: ProjectSizeDto[];
}
