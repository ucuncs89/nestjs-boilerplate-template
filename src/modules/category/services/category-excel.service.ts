import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryExcelService {
  constructor(private categoryService: CategoryService) {}
  async createCategoryExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      if (!data.category_name) {
        continue;
      } else {
        const findByName = await this.categoryService.findByName(
          data.category_name,
        );
        if (!findByName) {
          const payloadCategory = {
            name: data.category_name,
            sub_category: data.sub_category
              ? data.sub_category.split(',').map((item) => ({
                  name: item.trim(),
                }))
              : null,
          };
          await this.categoryService.create(payloadCategory, user_id, i18n);
        }
      }
    }
    return true;
  }
}
