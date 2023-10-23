import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { StatusProjectDetailEnum } from './create-project-detail.dto';
import { ProjectFabricDto } from './project-fabric.dto';
import { Type } from 'class-transformer';
import { ProjectAccessoriesSewingDTO } from './project-accessories-sewing.dto';
import { ProjectAccessoriesPackagingDto } from './project-accessories-packaging.dto';

export class CreateProjectMaterialDto {
  @ApiProperty()
  @IsNotEmpty()
  material_source: string;

  @ApiProperty({ enum: StatusProjectDetailEnum })
  @IsEnum(StatusProjectDetailEnum)
  @IsNotEmpty()
  status: StatusProjectDetailEnum;

  @ApiProperty()
  fabric_percentage_of_loss?: number;

  @ApiProperty()
  sewing_accessories_percentage_of_loss?: number;

  @ApiProperty()
  packaging_accessories_percentage_of_loss?: number;

  @ApiProperty()
  finished_goods_percentage_of_loss?: number;

  @ApiProperty()
  packaging_instructions?: string;

  @ApiProperty()
  total_price?: number;

  @ApiProperty({
    isArray: true,
    type: ProjectFabricDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectFabricDto)
  fabric?: ProjectFabricDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectAccessoriesSewingDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessoriesSewingDTO)
  accessories_sewing?: ProjectAccessoriesSewingDTO[];

  @ApiProperty({
    isArray: true,
    type: ProjectAccessoriesPackagingDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessoriesPackagingDto)
  accessories_packaging?: ProjectAccessoriesPackagingDto[];
}
