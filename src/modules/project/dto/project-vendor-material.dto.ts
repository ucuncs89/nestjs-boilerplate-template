import { ApiProperty } from '@nestjs/swagger';
import { ProjectVendorMaterialFabricDto } from './project-vendor-material-fabric.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectVendorMaterialSewingDto } from './project-vendor-material-sewing.dto';
import { ProjectVendorMaterialPackagingDto } from './project-vendor-material-packaging.dto';
import { ProjectVendorMaterialFinishedGoodDto } from './project-vendor-material-finished-good.dto';

export class ProjectVendorMaterialDto {
  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialFabricDto,
  })
  // @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialFabricDto)
  vendor_fabric?: ProjectVendorMaterialFabricDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialSewingDto,
  })
  // @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialSewingDto)
  vendor_accessories_sewing?: ProjectVendorMaterialSewingDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialPackagingDto,
  })
  // @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialPackagingDto)
  vendor_accessories_packaging?: ProjectVendorMaterialPackagingDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialFinishedGoodDto,
  })
  // @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialFinishedGoodDto)
  vendor_finished_good?: ProjectVendorMaterialFinishedGoodDto[];
}
