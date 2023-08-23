import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVendorNoteDto {
  @ApiProperty()
  @IsNotEmpty()
  note: string;
}
