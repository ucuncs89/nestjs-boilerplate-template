import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubCategoryDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  parent_id?: number;

  deleted_at?: string;
  deleted_by?: number;
}
export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    isArray: true,
    type: SubCategoryDto,
  })
  @ApiProperty({
    isArray: true,
    type: SubCategoryDto,
  })
  @IsNotEmpty()
  sub_category: SubCategoryDto[];
}
