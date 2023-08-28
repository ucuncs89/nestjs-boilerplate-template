import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActivationCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  is_active: boolean;
}
