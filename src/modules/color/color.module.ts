import { Module } from '@nestjs/common';
import { ColorService } from './services/color.service';
import { ColorController } from './controllers/color.controller';
import { ColorEntity } from 'src/entities/colors/color.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
