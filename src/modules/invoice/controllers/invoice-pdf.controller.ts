import { Controller, Get, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { InvoiceService } from '../services/invoice.service';
import { InvoicePdfService } from '../services/invoice-pdf.service';

@ApiBearerAuth()
@ApiTags('invoice')
@Controller('ivnoce')
export class InvoicePdfController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoicePdfService: InvoicePdfService,
  ) {}
  @Get(':id/detail/download-pdf')
  async donwloadPdfInvoice(@Res() res, @Param('id') id: number): Promise<void> {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.invoiceService.findDetail(id);
    const html = await this.invoicePdfService.generatePdf({
      ...detail,
      company,
    });

    res.type('text/html');

    // Send the HTML content as the response
    res.send(html);
  }
}
