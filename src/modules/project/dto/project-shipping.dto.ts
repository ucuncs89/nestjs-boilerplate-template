import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectShippingDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  shipping_date: string;

  @ApiProperty()
  shipping_cost?: number;

  project_detail_id?: number;

  created_by?: number;
  created_at?: string;
}
export class CreateProjectShippingDto {
  @ApiProperty({
    isArray: true,
    type: ProjectShippingDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectShippingDto)
  shipping?: ProjectShippingDto[];
}

// export class UpdateProjectFabricDto extends PartialType(ProjectFabricDto) {}

export class GetListProjectShippingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
