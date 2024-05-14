import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProjectSalesService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,

    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,
  ) {}

  async mappingDetailSalesQuotes(
    project_id: number,
    project_selling_price: number,
    arrVariant?: ProjectVariantEntity[],
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      relations: { customers: true },
    });
    const arrDetail = [];

    const item = arrVariant.map((variant) => variant.name).join(', ');
    const quantity = arrVariant.reduce(
      (sum, variant) => sum + variant.total_item,
      0,
    );
    const sub_total = quantity * project_selling_price;
    arrDetail.push({
      item: `${project.style_name}`,
      description: `${item}`,
      quantity,
      price: project_selling_price,
      sub_total,
    });

    const result = {
      sales_number: `SQ-${project.code}`,
      created_at: project.created_at,
      company_name: project.company,
      company_address: project?.customers?.company_address || '',
      company_phone_number: project?.customers?.company_phone_number || '',
      type: 'quotation',
    };
    return { ...result, detail: arrDetail, total: arrDetail[0].sub_total };
  }
  async mappingDetailSalesOrder(
    project_id: number,
    project_selling_price: number,
    arrVariant?: ProjectVariantEntity[],
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      relations: { customers: true },
    });
    const arrDetail = [];

    const item = arrVariant.map((variant) => variant.name).join(', ');
    const quantity = arrVariant.reduce(
      (sum, variant) => sum + variant.total_item,
      0,
    );
    const sub_total = quantity * project_selling_price;
    arrDetail.push({
      item: `${project.style_name}`,
      description: `${item}`,
      quantity,
      price: project_selling_price,
      sub_total,
    });

    const result = {
      sales_number: `SO-${project.code}`,
      created_at: project.created_at,
      company_name: project.company,
      company_address: project?.customers?.company_address || '',
      company_phone_number: project?.customers?.company_phone_number || '',
      type: 'order',
    };
    return { ...result, detail: arrDetail, total: arrDetail[0].sub_total };
  }
}
