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
}
