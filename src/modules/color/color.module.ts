import { Module } from '@nestjs/common';
import { ColorService } from './services/color.service';
import { ColorController } from './controllers/color.controller';
import { ColorEntity } from 'src/entities/colors/color.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorExcelController } from './controllers/color-excel.controller';
import { ColorExcelService } from './services/color-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController, ColorExcelController],
  providers: [ColorService, ColorExcelService],
})
export class ColorModule {}
