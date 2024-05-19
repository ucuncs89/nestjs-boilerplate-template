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
        status_description: createProjectDto.status_description,
      });
      await this.projectHistoryRepository.save(data);
    } else {
      await this.projectHistoryRepository.update(
        {
          id: projectHistory.id,
        },
        {
          status: createProjectDto.status,
          created_at: new Date().toISOString(),
          created_by: user_id,
          status_description: createProjectDto.status_description,
        },
      );
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
        status_description: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        users: {
          id: true,
          full_name: true,
        },
      },
      where: { project_id },
      order: orderObj,
      take: page_size,
      skip: page,
      relations: { users: true },
    });
    return {
      results,
      total_data: total,
    };
  }
}
