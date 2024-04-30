import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusProjectEnum } from './get-list-project.dto';

export class CreateProjecHistorytDto {
  @ApiProperty({ enum: StatusProjectEnum })
  @IsEnum(StatusProjectEnum)
  @IsNotEmpty()
  status: StatusProjectEnum;

  @ApiProperty()
  status_description?: string;

  project_id?: number;
}
