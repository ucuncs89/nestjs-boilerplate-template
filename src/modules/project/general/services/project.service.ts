import { Injectable } from '@nestjs/common';
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
  Not,
  Repository,
} from 'typeorm';
import {
  CreateProjectDto,
  ProjectMaterialSourceDto,
} from '../dto/create-project.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectDocumentEntity } from 'src/entities/project/project_document.entity';
import {
  GetListProjectDto,
  StatusProjectEnum,
} from '../dto/get-list-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}
  async generate(user_id: number) {
    const findProject = await this.projectRepository.findOne({
      where: {
        created_by: user_id,
        status: 'Draft',
      },
    });
    if (!findProject) {
      const data = this.projectRepository.create({
        code: '',
        style_name: '',
        customer_id: 0,
        deadline: '1970-01-01',
        order_type: '',
        created_at: '1970-01-01',
        created_by: user_id,
        status: 'Draft',
      });
      await this.projectRepository.save(data);
      return { id: data.id };
    }
    return { id: findProject.id };
  }

  async createUpdate(
    id: number,
    createProjectDto: CreateProjectDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const data = await queryRunner.manager.update(ProjectEntity, id, {
        style_name: createProjectDto.style_name,
        customer_id: createProjectDto.customer_id,
        deadline: createProjectDto.deadline,
        order_type: createProjectDto.order_type,
        description: createProjectDto.description,
        company: createProjectDto.company,
        user_id: createProjectDto.user_id,
        target_price_for_customer: createProjectDto.target_price_for_buyer,
        department_id: createProjectDto.departement_id,
        category_id: createProjectDto.category_id,
        sub_category_id: createProjectDto.sub_category_id,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      for (const documents of createProjectDto.project_document) {
        documents.project_id = id;
      }
      await queryRunner.manager.delete(ProjectDocumentEntity, {
        project_id: id,
      });
      await queryRunner.manager.insert(
        ProjectDocumentEntity,
        createProjectDto.project_document,
      );

      await queryRunner.commitTransaction();
      return { id, ...createProjectDto, data };
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
          status: status ? status : Not(In(['Draft'])),
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
          status: status ? status : Not(In(['Draft'])),
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
        variant: true,
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
  async updateMaterialSource(
    project_id: number,
    projectMaterialSourceDto: ProjectMaterialSourceDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          material_source: projectMaterialSourceDto.material_source,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async publishNewProject(project_id: number, user_id: number) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: project_id },
      });
      if (!project) {
        throw new AppErrorNotFoundException();
      }
      const generateCode = await this.generateCodeProject(
        project.company,
        project.order_type,
      );
      project.status = StatusProjectEnum.Project_Created;
      project.updated_at = new Date().toISOString();
      project.updated_by = user_id;
      project.code = generateCode.codeProject;
      project.sequential_number = generateCode.sequential_number;
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      throw new AppErrorException(error);
    }
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
        where: {
          status: Not('Draft'),
        },
        select: { id: true, sequential_number: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = project[0]
        ? `${parseInt(project[0].sequential_number) + 1}`
        : '1';
      return {
        codeProject: `${companyCode}${year}${month}${typeProject}-${
          pad.substring(0, pad.length - id.length) + id
        }`,
        sequential_number: id,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
