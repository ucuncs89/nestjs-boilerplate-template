import { Injectable } from '@nestjs/common';
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
  ProjectPaymentMethod,
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
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,

    @InjectRepository(ProjectHistoryEntity)
    private projectHistoryRepository: Repository<ProjectHistoryEntity>,

    private connection: Connection,
  ) {}
  async generate(user_id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectOlderDraft = await queryRunner.manager.findOne(
        ProjectEntity,
        { where: { created_by: user_id, status: 'Draft' } },
      );

      if (projectOlderDraft !== null) {
        await queryRunner.manager.delete(ProjectEntity, {
          id: projectOlderDraft.id,
        });
        await queryRunner.manager.delete(ProjectSizeEntity, {
          project_id: projectOlderDraft.id,
        });
        await queryRunner.manager.delete(ProjectVariantEntity, {
          project_id: projectOlderDraft.id,
        });
      }
      const data = await queryRunner.manager.insert(ProjectEntity, {
        code: '',
        style_name: '',
        customer_id: 0,
        deadline: '1970-01-01',
        order_type: '',
        created_at: '1970-01-01',
        created_by: user_id,
        status: 'Draft',
      });
      await queryRunner.commitTransaction();
      return { id: data.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
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
        payment_method: createProjectDto.payment_method,
        down_payment_percentage: createProjectDto.down_payment_percentage,
        payment_duration: createProjectDto.payment_duration,
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
    let arrStatus: any[] = status ? status.split(',') : [];
    if (status === StatusProjectEnum.In_Progress) {
      arrStatus = [
        StatusProjectEnum.Costing,
        StatusProjectEnum.Sampling,
        StatusProjectEnum.Planning,
        StatusProjectEnum.Production,
      ];
    }
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
          status: arrStatus.length > 0 ? In(arrStatus) : Not(In(['Draft'])),
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
          status: arrStatus.length > 0 ? In(arrStatus) : Not(In(['Draft'])),
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
        material_source: true,
        can_planning: true,
        can_production: true,
        hold_description: true,
        payment_method: true,
        down_payment_percentage: true,
        payment_duration: true,
        total_planning_price: true,
        total_production_price: true,
        total_costing_price: true,
        total_sampling_price: true,
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
        variant: {
          id: true,
          item_unit: true,
          name: true,
          project_id: true,
          total_item: true,
          deleted_at: true,
          deleted_by: true,
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
        size: { deleted_at: IsNull(), deleted_by: IsNull() },
        variant: { deleted_at: IsNull(), deleted_by: IsNull() },
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    let due_date_payment_duration: string = null;
    let is_past_due_date_payment_duration: boolean = null;
    if (
      data.payment_method === ProjectPaymentMethod.tempo &&
      data.payment_duration
    ) {
      const createdAt = new Date(data.deadline);
      createdAt.setDate(createdAt.getDate() + data.payment_duration);
      due_date_payment_duration = new Date(createdAt).toISOString();
      if (createdAt.getTime() < new Date().getTime()) {
        is_past_due_date_payment_duration = true;
      } else {
        is_past_due_date_payment_duration = false;
      }
    }
    return {
      ...data,
      due_date_payment_duration,
      is_past_due_date_payment_duration,
    };
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
      if (project.status === 'Draft') {
        project.status = StatusProjectEnum.Project_Created;
        project.code = generateCode.codeProject;
        project.sequential_number = generateCode.sequential_number;
      }
      project.updated_at = new Date().toISOString();
      project.updated_by = user_id;

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
  async holdProject(
    project_id: number,
    hold_description: string,
    user_id: number,
  ) {
    const project = await this.projectRepository.findOne({
      where: {
        id: project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!project) {
      throw new AppErrorNotFoundException('Project not found');
    }
    if (project.status === StatusProjectEnum.Hold) {
      return true;
    }
    try {
      project.hold_description = hold_description;
      project.status_before_change = project.status;
      project.updated_at = new Date().toISOString();
      project.updated_by = user_id;
      project.status = StatusProjectEnum.Hold;
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async cancelProject(
    project_id: number,
    cancel_description: string,
    user_id: number,
  ) {
    const project = await this.projectRepository.findOne({
      where: {
        id: project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!project) {
      throw new AppErrorNotFoundException('Project not found');
    }
    if (project.status === StatusProjectEnum.Canceled) {
      return true;
    }
    try {
      project.cancel_description = cancel_description;
      project.status_before_change = project.status;
      project.updated_at = new Date().toISOString();
      project.updated_by = user_id;
      project.status = StatusProjectEnum.Canceled;
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async unCancelProject(project_id: number) {
    const dataHistoryStatus = await this.projectHistoryRepository.findOne({
      where: {
        project_id,
        status: Not(In([StatusProjectEnum.Canceled, StatusProjectEnum.Hold])),
      },
      order: { id: 'DESC' },
    });
    if (!dataHistoryStatus) {
      throw new AppErrorException(
        'previous project history data does not exist',
      );
    }
    try {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          status: dataHistoryStatus.status || StatusProjectEnum.Project_Created,
          status_before_change: null,
          cancel_description: null,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async unHoldProject(project_id: number) {
    const dataHistoryStatus = await this.projectHistoryRepository.findOne({
      where: {
        project_id,
        status: Not(In([StatusProjectEnum.Canceled, StatusProjectEnum.Hold])),
      },
      order: { id: 'DESC' },
    });
    if (!dataHistoryStatus) {
      throw new AppErrorException(
        'previous project history data does not exist',
      );
    }
    try {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          status: dataHistoryStatus.status || StatusProjectEnum.Project_Created,
          status_before_change: null,
          hold_description: null,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async remove(id: number, user_id: number) {
    const data = await this.projectRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }
  async findCustomerRelation(id: number) {
    const data = await this.projectRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: { customers: true },
    });
    if (!data) {
      return null;
    }
    return data.customers;
  }
  async updateTotalPlanningPrice(
    project_id: number,
    total_planning_price: number,
  ) {
    const data = await this.projectRepository.update(
      {
        id: project_id,
      },
      {
        total_planning_price,
      },
    );
    return data;
  }
  async updateTotalProductionPrice(
    project_id: number,
    total_production_price: number,
  ) {
    const data = await this.projectRepository.update(
      {
        id: project_id,
      },
      {
        total_production_price,
      },
    );
    return data;
  }
}
