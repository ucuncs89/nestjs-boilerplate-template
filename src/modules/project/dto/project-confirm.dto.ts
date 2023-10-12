import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusProjectDetailEnum } from './create-project-detail.dto';

export class ProjectConfirmDto {
  @ApiProperty({ enum: StatusProjectDetailEnum })
  @IsEnum(StatusProjectDetailEnum)
  @IsNotEmpty()
  status: StatusProjectDetailEnum;

  @IsNotEmpty()
  @ApiProperty()
  is_confirmation: boolean;
}
