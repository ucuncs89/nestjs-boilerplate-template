import { Injectable } from '@nestjs/common';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectDocumentEntity } from 'src/entities/project/project_document.entity';

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
      await queryRunner.manager.update(ProjectEntity, id, {
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
      return { id, ...createProjectDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
