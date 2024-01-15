import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { Repository } from 'typeorm';
import { CreateProjecHistorytDto } from '../dto/create-project-history.dto';
import { GetListProjectHistoryDto } from '../dto/get-list-project-history.dto';

@Injectable()
export class ProjectHistoryService {
  constructor(
    @InjectRepository(ProjectHistoryEntity)
    private projectHistoryRepository: Repository<ProjectHistoryEntity>,
  ) {}
  async create(
    createProjectDto: CreateProjecHistorytDto,
    project_id: number,
    user_id,
    i18n,
  ) {
    const projectHistory = await this.projectHistoryRepository.findOne({
      where: { project_id, status: createProjectDto.status },
    });
    if (!projectHistory) {
      const data = this.projectHistoryRepository.create({
        status: createProjectDto.status,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      this.projectHistoryRepository.save(data);
    }
  }
  async findAll(query: GetListProjectHistoryDto, project_id: number) {
    const { page, page_size, sort_by, order_by } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [results, total] = await this.projectHistoryRepository.findAndCount({
      select: {
        id: true,
        project_id: true,
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },

      where: { project_id },
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      results,
      total_data: total,
    };
  }
}
