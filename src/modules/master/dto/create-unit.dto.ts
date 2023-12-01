import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  code: string;
}

export class UnitDto {
  @ApiProperty({
    isArray: true,
    type: CreateUnitDto,
  })
  @ApiProperty()
  unit: CreateUnitDto[];
}
