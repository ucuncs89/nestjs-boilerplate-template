import { PartialType } from '@nestjs/swagger';
import { CreateFabricVendorDto } from './create-fabric-vendor.dto';

export class UpdateFabricVendorDto extends PartialType(CreateFabricVendorDto) {}
