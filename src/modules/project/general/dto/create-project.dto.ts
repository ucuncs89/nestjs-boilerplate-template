import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TypeProjectDocumentsEnum {
  FILE = 'FILE',
  LINK = 'LINK',
}
export class ProjectSizeDto {
  @ApiProperty()
  size_ratio: string;

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
export enum ProjectPaymentMethod {
  cash = 'cash',
  downpayment = 'downpayment',
  tempo = 'tempo',
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
  departement_id: number;

  @ApiProperty()
  category_id: number;

  @ApiProperty()
  sub_category_id: number;

  @ApiProperty({
    isArray: true,
    type: ProjectDocumentsDto,
  })
  @ApiProperty()
  project_document?: ProjectDocumentsDto[];

  @ApiProperty({ enum: ProjectPaymentMethod })
  @IsNotEmpty()
  payment_method: ProjectPaymentMethod;

  @ApiProperty()
  down_payment_percentage?: number;

  @ApiProperty()
  payment_duration?: number;
}

export enum MaterialSourceTypeProjectEnum {
  BuyFabrics = 'Buy Fabrics',
  PurchaseFinishedGoods = 'Purchase finished goods',
}

export class ProjectMaterialSourceDto {
  @ApiProperty({ enum: MaterialSourceTypeProjectEnum })
  @IsEnum(MaterialSourceTypeProjectEnum)
  @IsNotEmpty()
  material_source: MaterialSourceTypeProjectEnum;
}
