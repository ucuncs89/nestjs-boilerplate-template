import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceAdditionalEntity } from 'src/entities/project/project_price_additional.entity';

@Injectable()
export class ProjectConfirmationProductionService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,

    @InjectRepository(ProjectPriceAdditionalEntity)
    private projectPriceAdditionalRepository: Repository<ProjectPriceAdditionalEntity>,

    private connection: Connection,
  ) {}
  async checkDelivered(project_detail_id) {
    return true;
  }
  async checkArrivedDestination(project_detail_id) {
    return true;
  }
  async checkInvoicePaid(project_detail_id) {
    return true;
  }
}
