import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusProjectDetailEnum } from '../../general/dto/create-project-detail.dto';

export class ProjectPlanningConfirmDto {
  @ApiProperty({ enum: StatusProjectDetailEnum })
  @IsEnum(StatusProjectDetailEnum)
  @IsNotEmpty()
  status: StatusProjectDetailEnum;

  @IsNotEmpty()
  @ApiProperty()
  is_confirmation: boolean;
}
