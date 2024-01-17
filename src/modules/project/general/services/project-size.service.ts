import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { IsNull, Repository } from 'typeorm';
import { ProjectSizeDto } from '../dto/create-project.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';

@Injectable()
export class ProjectSizeService {
  constructor(
    @InjectRepository(ProjectSizeEntity)
    private projectSizeRepository: Repository<ProjectSizeEntity>,

    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,
  ) {}
  async create(
    project_id: number,
    projectSizeDto: ProjectSizeDto,
    user_id: number,
  ) {
    try {
      const size = this.projectSizeRepository.create({
        project_id,
        size_ratio: projectSizeDto.size_ratio,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectSizeRepository.save(size);
      return size;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findAllProjectSize(project_id) {
    const data = await this.projectSizeRepository.find({
      select: { id: true, project_id: true, size_ratio: true },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async updateProjectSize(
    size_id: number,
    project_id: number,
    projectSizeDto: ProjectSizeDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectSizeRepository.update(
        {
          project_id,
          id: size_id,
        },
        {
          size_ratio: projectSizeDto.size_ratio,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteProjectSize(
    size_id: number,
    project_id: number,
    user_id: number,
  ) {
    try {
      const data = await this.projectSizeRepository.update(
        {
          project_id,
          id: size_id,
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async calculateTotalItem(project_id: number) {
    const arrIds = [];
    const arrVariant = await this.projectVariantRepository.find({
      where: { project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: { id: true, project_id: true },
    });
    arrVariant.map((v) => arrIds.push(v.id));
    const dataSize = await this.projectVariantRepository.query(`select
    size_id,
    sum(pvs.number_of_item)
  from
    project_variant_size pvs
  where
    pvs.project_variant_id in (${arrIds})
    and 
    pvs.size_id is not null
  group by
    size_id`);
    for (let i = 0; i < dataSize.length; i++) {
      this.projectSizeRepository.update(
        { id: dataSize[i].size_id },
        { total_item: dataSize[i].sum },
      );
    }
  }
}
