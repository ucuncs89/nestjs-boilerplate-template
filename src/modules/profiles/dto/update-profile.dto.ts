import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Full Name Is Required' })
  full_name: string;

  @ApiProperty()
  base_path?: string;

  @ApiProperty()
  path_picture?: string;
}
