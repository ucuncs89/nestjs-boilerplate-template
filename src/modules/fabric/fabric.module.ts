import { Module } from '@nestjs/common';
import { FabricService } from './services/fabric.service';
import { FabricController } from './controllers/fabric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricEntity } from 'src/entities/fabric/fabric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FabricEntity])],
  controllers: [FabricController],
  providers: [FabricService],
})
export class FabricModule {}
