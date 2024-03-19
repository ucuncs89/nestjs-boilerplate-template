import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
  Res,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectProductionShippingService } from '../services/project-production-shipping.service';
import {
  ProjectProductionShippingDto,
  ProjectProductionShippingSendtoEnum,
} from '../dto/project-production-shipping.dto';
import { ProjectProductionShippingPackingDto } from '../dto/project-production-shipping-packing.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from 'src/entities/customers/customers.entity';
import { Repository } from 'typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { ProjectProductionShippingPdfService } from '../services/project-production-shipping-pdf.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';

@ApiBearerAuth()
@ApiTags('project production')
@Controller('project/production')
export class ProjectProductionShippingController {
  constructor(
    private readonly projectProductionShippingService: ProjectProductionShippingService,
    private readonly projectProductionShippingPdfService: ProjectProductionShippingPdfService,
    private readonly projectVariantService: ProjectVariantService,

    @InjectRepository(CustomersEntity)
    private customersRepository: Repository<CustomersEntity>,

    @InjectRepository(VendorsEntity)
    private vendorsRepository: Repository<VendorsEntity>,

    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.findShipping(
      project_id,
    );
    return {
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectProductionShippingDto: ProjectProductionShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item =
      projectProductionShippingDto.total_shipping_cost / variantTotalItem;
    const data = await this.projectProductionShippingService.createShipping(
      project_id,
      projectProductionShippingDto,
      req.user.id,
      cost_per_item,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':project_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectProductionShippingDto: ProjectProductionShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item =
      projectProductionShippingDto.total_shipping_cost / variantTotalItem;
    const data = await this.projectProductionShippingService.updateShipping(
      shipping_id,
      projectProductionShippingDto,
      req.user.id,
      cost_per_item,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/shipping/:shipping_id')
  async getDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':project_id/shipping/:shipping_id')
  async deleteDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.deleteShipping(
      shipping_id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/shipping/:shipping_id/packing-list')
  async postPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.createPackingList(
      shipping_id,
      projectProductionShippingPackingDto,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':project_id/shipping/:shipping_id/packing-list/:packing_id')
  async putPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,
    @Body()
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.updatePackingList(
      shipping_id,
      packing_id,
      projectProductionShippingPackingDto,
      req.user.id,
    );
    return { data };
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':project_id/shipping/:shipping_id/packing-list/:packing_id')
  async deletePackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,

    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.deletePackingList(
      shipping_id,
      packing_id,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/shipping/:shipping_id/delivery-note')
  async getDetailProjectShippingDeliveryNote(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const projectCustomer = await this.projectRepository.findOne({
      where: { id: project_id },
      select: { id: true, customer_id: true },
    });
    const data = await this.projectProductionShippingService.findDeliverDetail(
      shipping_id,
    );
    if (!data) {
      throw new AppErrorException('data project and shipping not recognize');
    }
    const style_name = data.project ? data.project.style_name : '';
    const detail =
      await this.projectProductionShippingService.findDeliverNoteItem(
        shipping_id,
        style_name,
      );
    let destination: object;
    if (data.send_to === ProjectProductionShippingSendtoEnum.Buyer) {
      destination = await this.customersRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: projectCustomer.customer_id },
      });
    } else if (data.send_to === ProjectProductionShippingSendtoEnum.Vendor) {
      destination = await this.vendorsRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: data.relation_id },
      });
    }
    return { data: { ...data, detail, destination } };
  }

  @Get(':project_id/shipping/:shipping_id/delivery-note/download-pdf')
  async downloadPdfProjectShippingDeliveryNote(
    @Req() req,
    @Res() res,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const projectCustomer = await this.projectRepository.findOne({
      where: { id: project_id },
      select: { id: true, customer_id: true },
    });
    const data = await this.projectProductionShippingService.findDeliverDetail(
      shipping_id,
    );
    if (!data) {
      throw new AppErrorException('data project and shipping not recognize');
    }
    const style_name = data.project ? data.project.style_name : '';
    const detail =
      await this.projectProductionShippingService.findDeliverNoteItem(
        shipping_id,
        style_name,
      );
    let destination: object;
    if (data.send_to === ProjectProductionShippingSendtoEnum.Buyer) {
      destination = await this.customersRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: projectCustomer.customer_id },
      });
    } else if (data.send_to === ProjectProductionShippingSendtoEnum.Vendor) {
      destination = await this.vendorsRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: data.relation_id },
      });
    }
    const html = await this.projectProductionShippingPdfService.generatePdf({
      ...data,
      detail,
      destination,
    });

    res.type('text/html');
    res.send(html);
  }
}
