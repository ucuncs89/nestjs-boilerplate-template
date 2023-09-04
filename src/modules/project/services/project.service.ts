import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import { ProjectDocumentEntity } from 'src/entities/project/project_document.entity';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { GetListProjectDto } from '../dto/get-list-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}
  async create(createProjectDto: CreateProjectDto, user_id, i18n) {
    const code = await this.generateCodeProject();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const project = await queryRunner.manager.insert(ProjectEntity, {
        ...createProjectDto,
        created_by: user_id,
        code,
        status: 'Planning',
      });
      for (const documents of createProjectDto.project_document) {
        documents.project_id = project.raw[0].id;
      }
      for (const size of createProjectDto.size) {
        size.project_id = project.raw[0].id;
      }

      await queryRunner.manager.insert(
        ProjectDocumentEntity,
        createProjectDto.project_document,
      );

      await queryRunner.manager.insert(
        ProjectSizeEntity,
        createProjectDto.size,
      );
      await queryRunner.commitTransaction();
      return { ...createProjectDto, id: project.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findAll(query: GetListProjectDto) {
    const { page, page_size, sort_by, order_by, status, keyword, order_type } =
      query;
    let orderObj = {};
    switch (sort_by) {
      case 'name':
        orderObj = {
          style_name: order_by,
        };
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [results, total] = await this.projectRepository.findAndCount({
      select: {
        id: true,
        code: true,
        company: true,
        status: true,
        style_name: true,
        deadline: true,
        order_type: true,
        target_price_for_customer: true,
        user_id: true,
        created_at: true,
        updated_at: true,
      },
      where: [
        {
          style_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          order_type: order_type ? order_type : Not(IsNull()),
          deleted_at: IsNull(),
        },
        {
          code: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          order_type: order_type ? order_type : Not(IsNull()),
          deleted_at: IsNull(),
        },
      ],

      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      results,
      total_data: total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  async remove(id: number, user_id) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new AppErrorNotFoundException();
    }
    project.deleted_at = new Date().toISOString();
    project.deleted_by = user_id;
    await this.projectRepository.save(project);
    return true;
  }

  async generateCodeProject() {
    const pad = '0000';
    try {
      const project = await this.projectRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = project[0] ? `${project[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }
}
