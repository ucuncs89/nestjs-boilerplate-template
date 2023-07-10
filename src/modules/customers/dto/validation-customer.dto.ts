import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusCustomerEnum } from './get-list-custmer.dto';

export class ValidationCustomerDto {
  @ApiProperty({ required: false, enum: StatusCustomerEnum })
  @IsNotEmpty()
  @IsEnum(StatusCustomerEnum)
  status: StatusCustomerEnum;
}
