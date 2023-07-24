import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusVendorEnum } from './get-list-vendor.dto';

export class ValidationVendorDto {
  @ApiProperty({ required: false, enum: StatusVendorEnum })
  @IsNotEmpty()
  @IsEnum(StatusVendorEnum)
  status: StatusVendorEnum;
}
