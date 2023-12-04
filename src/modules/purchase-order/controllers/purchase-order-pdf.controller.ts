import { Controller, Get, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PurchaseOrderPdfService } from '../services/purcahse-order-pdf.service';

@ApiBearerAuth()
@ApiTags('Purchase Order')
// @UseGuards(JwtAuthGuard)
@Controller('purchase-order')
export class PurchaseOrderPdfController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly purchaseOrderPdfService: PurchaseOrderPdfService,
  ) {}
  @Get(':id/detail/download-pdf')
  async findDetailPurchase(@Res() res, @Param('id') id: number): Promise<void> {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.purchaseOrderService.findDetail(id);
    const pdfBuffer = await this.purchaseOrderPdfService.generatePdf({
      ...detail,
      company,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=purchase_order.pdf',
    });

    res.send(pdfBuffer);
  }
}
