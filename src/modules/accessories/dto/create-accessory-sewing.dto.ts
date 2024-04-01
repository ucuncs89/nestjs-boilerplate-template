import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAccessorySewingDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ isArray: true })
  category: string[];

  @IsNotEmpty()
  @ApiProperty({ isArray: true })
  unit_of_measure: string[];
}
