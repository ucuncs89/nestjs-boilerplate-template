import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectProformaInvoiceDto } from '../dto/project-proforma-invoice.dto';
import { ProjectService } from '../services/project.service';
import {
  InvoicePPHTypeEnum,
  InvoicePPNTypeEnum,
  InvoiceTypeEnum,
} from 'src/modules/invoice/dto/invoice.dto';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectProformaInvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/proforma-invoice')
  async findAll(
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.invoiceService.findByProjectId(
      project_id,
      InvoiceTypeEnum.proforma,
    );
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/proforma-invoice')
  async create(
    @Req() req,
    @Body() projectProformaInvoiceDto: ProjectProformaInvoiceDto,
    @Param('project_id') project_id: number,
  ) {
    const invoiceDetailDto = [];

    const customer = await this.projectService.findCustomerRelation(project_id);
    invoiceDetailDto.push({
      item: `${projectProformaInvoiceDto.description}`,
      unit: 'PCS',
      quantity: null,
      unit_price: null,
      sub_total: projectProformaInvoiceDto.total_dp,
    });

    const grand_total = projectProformaInvoiceDto.total_dp;
    const data = await this.invoiceService.create(
      project_id,
      {
        bank_name: customer.bank_name,
        company_name: customer.company_name,
        customer_id: customer.id,
        project_id,
        bank_account_houlders_name: customer.bank_account_holder_name,
        bank_account_number: customer.bank_account_number,
        company_address: customer.company_address,
        company_phone_number: customer.company_phone_number,
        type: InvoiceTypeEnum.proforma,
        pph_type: InvoicePPHTypeEnum.Non_PPH,
        ppn_type: InvoicePPNTypeEnum.Non_PPN,
      },
      req.user.id,
      invoiceDetailDto,
      grand_total,
    );
    return { data, grand_total };
  }
}

// @Put(':project_id/proforma-invoice/:invoice_id')
// async updateRemarks(
//   @Req() req,
//   @Body() projectReturDto: ProjectReturDto,
//   @Param('project_id') project_id: number,
//   @Param('retur_id') retur_id: number,
// ) {
//   const data = await this.projectReturService.update(
//     retur_id,
//     project_id,
//     projectReturDto,
//     req.user.id,
//   );
//   return { data };
// }

// @Delete(':project_id/proforma-invoice/:invoice_id')
// async deleteRemarks(
//   @Req() req,
//   @Param('project_id') project_id: number,
//   @Param('retur_id') retur_id: number,
// ) {
//   const data = await this.projectReturService.remove(
//     retur_id,
//     project_id,
//     req.user.id,
//   );
//   return { data };
// }
