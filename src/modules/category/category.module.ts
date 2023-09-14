import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from 'src/entities/categories/categories.entity';
import { CategoryExcelController } from './controllers/category-excel.controller';
import { CategoryExcelService } from './services/category-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEntity])],
  controllers: [CategoryController, CategoryExcelController],
  providers: [CategoryService, CategoryExcelService],
})
export class CategoryModule {}
