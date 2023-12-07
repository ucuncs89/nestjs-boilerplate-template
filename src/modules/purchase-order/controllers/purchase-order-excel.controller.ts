import { Controller, Get, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PurchaseOrderPdfService } from '../services/purchase-order-pdf.service';
import { PurchaseOrderExcelService } from '../services/purchase-order-excel.service';

@ApiBearerAuth()
@ApiTags('Purchase Order')
// @UseGuards(JwtAuthGuard)
@Controller('purchase-order')
export class PurchaseOrderExcelController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly purchaseOrderExcelService: PurchaseOrderExcelService,
  ) {}
  @Get(':id/detail/download-excel')
  async findDetailPurchase(@Res() res, @Param('id') id: number): Promise<void> {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.purchaseOrderService.findDetail(id);

    const excelBuffer = await this.purchaseOrderExcelService.generateExcel({
      ...detail,
      company,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=purchase_order.xlsx',
    );
    res.send(excelBuffer);
  }
}
