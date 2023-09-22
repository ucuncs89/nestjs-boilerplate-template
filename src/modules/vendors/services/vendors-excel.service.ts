import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';
import { Connection, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ProvinceService } from 'src/modules/region/services/province.service';
import { CityService } from 'src/modules/region/services/city.service';
import { ProvinceEntity } from 'src/entities/master/province.entity';
import { CityEntity } from 'src/entities/master/city.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { VendorsService } from './vendors.service';
@Injectable()
export class VendorsExcelService {
  constructor(
    @InjectRepository(VendorsEntity)
    private vendorsRepository: Repository<VendorsEntity>,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private vendorsService: VendorsService,
    private connection: Connection, // private readonly rolePermissionGuard: RolesPermissionGuard,
  ) {}
  async createVendorExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      let findIdProvince: ProvinceEntity;
      let findIdCity: CityEntity;
      if (data.province !== null || data.prvince !== '#N/A') {
        findIdProvince = await this.provinceService.findByName(data.province);
      }
      if (data.city !== null) {
        findIdCity = await this.cityService.findByName(data.city);
      }
      const findByName = await this.vendorsService.findByName(
        data.company_business_name.toString(),
      );
      if (!findByName) {
        const payloadVendor = {
          province_id: findIdProvince ? findIdProvince.id : null,
          city_id: findIdCity ? findIdCity.id : null,
          company_name: data.company_business_name.toString(),
          company_phone_number: data.company_phone_number || null,
          company_address: data.office_address,
          taxable: data.pkp_or_non_pkp,
          pic_full_name: data.full_name,
          pic_id_number: data.nik,
          pic_phone_number: data.phone_number,
          pic_email: data.email,
          status: data.validation ? data.validation : 'Not yet validated',
          npwp_number: data.npwp,
          bank_name: data.bank_name,
          bank_account_holder_name: data.account_holders_name,
          bank_account_number: data.account_number,
          is_active: data.status_active
            ? data.status_active === 'Active'
              ? true
              : false
            : null,
          vendor_type: data.vendor_type
            ? data.vendor_type.split('&').map((item) => ({
                name: item.trim(),
              }))
            : null,
        };
        // console.log(payloadVendor);

        await this.vendorsService.create(payloadVendor, user_id, i18n);
      }
    }
  }
}
