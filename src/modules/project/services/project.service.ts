import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import {
  Between,
  Connection,
  ILike,
  In,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { ProjectDocumentEntity } from 'src/entities/project/project_document.entity';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { GetListProjectDto } from '../dto/get-list-project.dto';
import { ProjectHistoryService } from './project-history.service';
import { StatusProjectHistoryEnum } from '../dto/create-project-history.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,

    @InjectRepository(ProjectSizeEntity)
    private projectSizeRepository: Repository<ProjectSizeEntity>,

    private connection: Connection,
    private projectHistoryService: ProjectHistoryService,
  ) {}
  async create(createProjectDto: CreateProjectDto, user_id, i18n) {
    const generateCodeProject = await this.generateCodeProject(
      createProjectDto.company,
      createProjectDto.order_type,
    );
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const project = await queryRunner.manager.insert(ProjectEntity, {
        ...createProjectDto,
        created_by: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: `${generateCodeProject.codeProject}${generateCodeProject.sequential_number}`,
        sequential_number: generateCodeProject.sequential_number,
        department_id: createProjectDto.departement_id,
        target_price_for_customer: createProjectDto.target_price_for_buyer,
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
      this.projectHistoryService.create(
        {
          status: StatusProjectHistoryEnum.Project_Created,
        },
        project.raw[0].id,
        user_id,
        i18n,
      );
      return { ...createProjectDto, id: project.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findAll(query: GetListProjectDto) {
    const {
      page,
      page_size,
      sort_by,
      order_by,
      status,
      keyword,
      order_type,
      deadline,
    } = query;
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
    let date_deadline;
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
        department_id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
        customers: {
          id: true,
          pic_full_name: true,
          code: true,
          company_name: true,
        },
        users: {
          id: true,
          full_name: true,
          base_path: true,
          path_picture: true,
        },
        departements: {
          id: true,
          code: true,
          name: true,
        },
        categories: {
          id: true,
          name: true,
        },
      },
      where: [
        {
          style_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(In([])),
          order_type: order_type ? order_type : Not(IsNull()),
          deleted_at: IsNull(),
          deadline:
            deadline === 'WeekMore'
              ? Between(
                  new Date().toISOString(),
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                )
              : deadline === 'Now'
              ? LessThan(new Date().toISOString())
              : Not(IsNull()),
        },
        {
          code: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(In([])),
          order_type: order_type ? order_type : Not(IsNull()),
          deleted_at: IsNull(),
          deadline:
            deadline === 'WeekMore'
              ? Between(
                  new Date().toISOString(),
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                )
              : deadline === 'Now'
              ? LessThan(new Date().toISOString())
              : Not(IsNull()),
        },
      ],
      relations: {
        users: true,
        departements: true,
        categories: true,
        customers: true,
      },
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      results,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.projectRepository.findOne({
      select: {
        id: true,
        code: true,
        company: true,
        status: true,
        style_name: true,
        deadline: true,
        order_type: true,
        target_price_for_customer: true,
        department_id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
        customer_id: true,
        category_id: true,
        sub_category_id: true,
        description: true,
        size: {
          id: true,
          project_id: true,
          size_ratio: true,
          number_of_item: true,
        },
        project_document: {
          id: true,
          project_id: true,
          type: true,
          base_url: true,
          file_url: true,
        },
        customers: {
          id: true,
          pic_full_name: true,
          code: true,
          company_name: true,
        },
        users: {
          id: true,
          full_name: true,
          base_path: true,
          path_picture: true,
        },
        departements: {
          id: true,
          code: true,
          name: true,
        },
        categories: {
          id: true,
          name: true,
        },
        sub_category: {
          id: true,
          name: true,
        },
      },
      relations: {
        customers: true,
        users: true,
        departements: true,
        categories: true,
        size: true,
        project_document: true,
        sub_category: true,
      },
      where: {
        id,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user_id) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        deleted_at: true,
        deleted_by: true,
        status: true,
        sequential_number: true,
      },
    });
    if (!project) {
      throw new AppErrorNotFoundException('Not Found');
    }
    const generateCodeProject = await this.generateCodeProject(
      updateProjectDto.company,
      updateProjectDto.order_type,
    );
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(ProjectEntity, id, {
        style_name: updateProjectDto.style_name,
        customer_id: updateProjectDto.customer_id,
        deadline: updateProjectDto.deadline,
        order_type: updateProjectDto.order_type,
        description: updateProjectDto.description,
        company: updateProjectDto.company,
        user_id: updateProjectDto.user_id,
        target_price_for_customer: updateProjectDto.target_price_for_buyer,
        department_id: updateProjectDto.departement_id,
        category_id: updateProjectDto.category_id,
        sub_category_id: updateProjectDto.sub_category_id,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
        code: `${generateCodeProject.codeProject}${project.sequential_number}`,
        sequential_number: generateCodeProject.sequential_number,
      });
      for (const documents of updateProjectDto.project_document) {
        documents.project_id = id;
      }
      for (const size of updateProjectDto.size) {
        size.project_id = id;
      }
      await queryRunner.manager.delete(ProjectDocumentEntity, {
        project_id: id,
      });

      await queryRunner.manager.delete(ProjectSizeEntity, {
        project_id: id,
      });

      await queryRunner.manager.insert(
        ProjectDocumentEntity,
        updateProjectDto.project_document,
      );
      await queryRunner.manager.insert(
        ProjectSizeEntity,
        updateProjectDto.size,
      );
      await queryRunner.commitTransaction();
      return { id, ...updateProjectDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
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

  async generateCodeProject(company: string, order_type: string) {
    let companyCode: string;
    let typeProject: string;
    switch (company) {
      case 'Sami Teknologi Internasional':
        companyCode = 'T';
        break;
      case 'Sami Kreasi Internasional':
        companyCode = 'K';
        break;
      default:
        companyCode = '';
        break;
    }
    switch (order_type) {
      case 'CMT':
        typeProject = 'C';
        break;
      case 'FOB':
        typeProject = 'F';
        break;
      case 'FABRIC':
        typeProject = 'K';
        break;
      default:
        typeProject = '';
        break;
    }
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');

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
      return {
        codeProject: `${companyCode}${year}${month}-${typeProject}`,
        sequential_number: pad.substring(0, pad.length - id.length) + id,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async findSize(project_id: number) {
    const data = await this.projectSizeRepository.find({
      where: {
        project_id,
      },
      select: {
        id: true,
        project_id: true,
        size_ratio: true,
        number_of_item: true,
      },
    });
    const sumOfItems = data.reduce((acc, item) => acc + item.number_of_item, 0);
    return { sum_total_item: sumOfItems, data };
  }
  async updateStatusProject(
    project_id: number,
    status: StatusProjectHistoryEnum,
    user_id,
  ) {
    this.projectRepository.update(
      { id: project_id },
      { status, updated_at: new Date().toISOString(), updated_by: user_id },
    );
  }

  async sumProjectSizeQuantity(project_id: number) {
    const data = await this.projectSizeRepository.sum('number_of_item', {
      project_id,
      deleted_at: IsNull(),
      deleted_by: IsNull(),
    });
    return data;
  }
}
