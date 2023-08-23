import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerNoteDto {
  @ApiProperty()
  @IsNotEmpty()
  note: string;
}
