import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectReturEntity } from 'src/entities/project/project_retur.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { IsNull, Repository } from 'typeorm';
import { ProjectReturDto } from '../dto/project-retur.dto';

Injectable();
export class ProjectReturService {
  constructor(
    @InjectRepository(ProjectReturEntity)
    private projectReturRepository: Repository<ProjectReturEntity>,
  ) {}
  async findAll(project_id: number) {
    const data = await this.projectReturRepository.find({
      select: {
        id: true,
        project_id: true,
        quantity: true,
        description: true,
        price_per_item: true,
        sub_total: true,
      },
      where: { project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    return data;
  }
  async create(
    project_id: number,
    projectReturDto: ProjectReturDto,
    user_id: number,
    price_per_item: number,
  ) {
    try {
      const retur = this.projectReturRepository.create({
        project_id,
        price_per_item,
        quantity: projectReturDto.quantity,
        description: projectReturDto.description,
        sub_total: projectReturDto.quantity * price_per_item,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectReturRepository.save(retur);
      return retur;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findOne(retur_id: number, project_id: number) {
    const data = await this.projectReturRepository.findOne({
      select: {
        id: true,
        project_id: true,
        quantity: true,
        description: true,
        price_per_item: true,
        sub_total: true,
      },
      where: {
        id: retur_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    retur_id: number,
    project_id: number,
    projectReturDto: ProjectReturDto,
    user_id: number,
  ) {
    try {
      const retur = await this.projectReturRepository.findOne({
        select: {
          id: true,
          project_id: true,
          quantity: true,
          description: true,
          price_per_item: true,
          sub_total: true,
        },
        where: {
          id: retur_id,
          project_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
      retur.quantity = projectReturDto.quantity;
      retur.description = projectReturDto.description;
      retur.sub_total = projectReturDto.quantity * retur.price_per_item;
      retur.updated_at = new Date().toISOString();
      retur.updated_by = user_id;
      await this.projectReturRepository.save(retur);
      return retur;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async remove(retur_id: number, project_id: number, user_id: number) {
    try {
      return await this.projectReturRepository.update(
        { id: retur_id, project_id },
        { deleted_at: new Date().toISOString(), deleted_by: user_id },
      );
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
