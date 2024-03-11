import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { InvoiceStatusEntity } from 'src/entities/invoice/invoice_status.entity';
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceStatusEntity])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
