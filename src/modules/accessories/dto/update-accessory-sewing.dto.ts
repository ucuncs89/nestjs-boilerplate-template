import { PartialType } from '@nestjs/swagger';
import { CreateAccessorySewingDto } from './create-accessory-sewing.dto';

export class UpdateAccessorySewingDto extends PartialType(
  CreateAccessorySewingDto,
) {}
