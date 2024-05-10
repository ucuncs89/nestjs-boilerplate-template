import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { InvoiceStatusEntity } from 'src/entities/invoice/invoice_status.entity';
import { InvoiceDetailEntity } from 'src/entities/invoice/invoice_detail.entity';
import { InvoicePdfController } from './controllers/invoice-pdf.controller';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { InvoiceJurnalService } from './services/invoice-jurnal.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceStatusEntity,
      InvoiceDetailEntity,
    ]),
    HttpModule,
  ],
  controllers: [InvoiceController, InvoicePdfController],
  providers: [InvoiceService, InvoicePdfService, InvoiceJurnalService],
})
export class InvoiceModule {}
