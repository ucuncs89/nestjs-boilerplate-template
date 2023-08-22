import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  color_code?: string;
}
