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
import { ProjectReturShippingService } from '../services/project-retur-shipping.service';
import {
  ProjectReturShippingDto,
  ProjectReturShippingSendtoEnum,
} from '../dto/project-retur-shipping.dto';
import { ProjectReturShippingPackingDto } from '../dto/project-retur-shipping-packing.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from 'src/entities/customers/customers.entity';
import { Repository } from 'typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { ProjectProductionShippingPdfService } from '../../production/services/project-production-shipping-pdf.service';
import { ProjectReturService } from '../../general/services/project-retur.service';

@ApiBearerAuth()
@ApiTags('project retur')
@Controller('project/retur')
export class ProjectReturShippingController {
  constructor(
    private readonly projectReturShippingService: ProjectReturShippingService,

    private readonly projectProductionShippingPdfService: ProjectProductionShippingPdfService,

    private projectReturService: ProjectReturService,

    @InjectRepository(CustomersEntity)
    private customersRepository: Repository<CustomersEntity>,

    @InjectRepository(VendorsEntity)
    private vendorsRepository: Repository<VendorsEntity>,

    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/:retur_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.findShipping(
      project_id,
      retur_id,
    );
    return {
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/:retur_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Body()
    projectReturShippingDto: ProjectReturShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const projecRetur = await this.projectReturService.findOne(
      retur_id,
      project_id,
    );
    const cost_per_item =
      projectReturShippingDto.total_shipping_cost / projecRetur.quantity;
    const data = await this.projectReturShippingService.createShipping(
      project_id,
      projectReturShippingDto,
      req.user.id,
      retur_id,
      cost_per_item,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':project_id/:retur_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectReturShippingDto: ProjectReturShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const projecRetur = await this.projectReturService.findOne(
      retur_id,
      project_id,
    );
    const cost_per_item =
      projectReturShippingDto.total_shipping_cost / projecRetur.quantity;
    const data = await this.projectReturShippingService.updateShipping(
      shipping_id,
      projectReturShippingDto,
      req.user.id,
      retur_id,
      cost_per_item,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':project_id/:retur_id/shipping/:shipping_id')
  async getDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':project_id/:retur_id/shipping/:shipping_id')
  async deleteDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.deleteShipping(
      shipping_id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/:retur_id/shipping/:shipping_id/packing-list')
  async postPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectReturShippingPackingDto: ProjectReturShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.createPackingList(
      shipping_id,
      projectReturShippingPackingDto,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':project_id/:retur_id/shipping/:shipping_id/packing-list/:packing_id')
  async putPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,
    @Body()
    projectReturShippingPackingDto: ProjectReturShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.updatePackingList(
      shipping_id,
      packing_id,
      projectReturShippingPackingDto,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(
    ':project_id/:retur_id/shipping/:shipping_id/packing-list/:packing_id',
  )
  async deletePackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,

    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturShippingService.deletePackingList(
      shipping_id,
      packing_id,
      req.user.id,
    );
    return { data };
  }
  @UseGuards(JwtAuthGuard)
  @Get(':project_id/:retur_id/shipping/:shipping_id/delivery-note')
  async getDetailProjectShippingDeliveryNote(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const projectCustomer = await this.projectRepository.findOne({
      where: { id: project_id },
      select: { id: true, customer_id: true },
    });
    const data = await this.projectReturShippingService.findDeliverDetail(
      shipping_id,
    );
    if (!data) {
      throw new AppErrorException('data project and shipping not recognize');
    }
    const style_name = data.project ? data.project.style_name : '';
    const detail = await this.projectReturShippingService.findDeliverNoteItem(
      shipping_id,
      style_name,
    );
    let destination: object;
    if (data.send_to === ProjectReturShippingSendtoEnum.Buyer) {
      destination = await this.customersRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: projectCustomer.customer_id },
      });
    } else if (data.send_to === ProjectReturShippingSendtoEnum.Vendor) {
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

  @Get(':project_id/:retur_id/shipping/:shipping_id/delivery-note/download-pdf')
  async downloadPdfProjectShippingDeliveryNote(
    @Req() req,
    @Res() res,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const projectCustomer = await this.projectRepository.findOne({
      where: { id: project_id },
      select: { id: true, customer_id: true },
    });
    const data = await this.projectReturShippingService.findDeliverDetail(
      shipping_id,
    );
    if (!data) {
      throw new AppErrorException('data project and shipping not recognize');
    }
    const style_name = data.project ? data.project.style_name : '';
    const detail = await this.projectReturShippingService.findDeliverNoteItem(
      shipping_id,
      style_name,
    );
    let destination: object;
    if (data.send_to === ProjectReturShippingSendtoEnum.Buyer) {
      destination = await this.customersRepository.findOne({
        select: {
          id: true,
          company_name: true,
          company_address: true,
          company_phone_number: true,
        },
        where: { id: projectCustomer.customer_id },
      });
    } else if (data.send_to === ProjectReturShippingSendtoEnum.Vendor) {
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
