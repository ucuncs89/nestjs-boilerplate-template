import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActivationVendorDto {
  @ApiProperty()
  @IsNotEmpty()
  is_active: boolean;
}
