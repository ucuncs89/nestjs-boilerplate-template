import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserActivationByAdminDto {
  @IsNotEmpty()
  @ApiProperty()
  is_active: false;
}
