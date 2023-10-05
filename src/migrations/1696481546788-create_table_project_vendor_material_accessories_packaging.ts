import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterialAccessoriesPackaging1696481546788
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterialAccessoriesPackaging1696481546788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_accessories_packaging" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "project_accessories_packaging_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_5f6a15489604a31de889bd06d89" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_accessories_packaging_detail" ("id" SERIAL NOT NULL, "project_vendor_material_accessories_packaging_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" integer, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_0e2e4383f2a732a50ee34397f11" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_accessories_packaging_detail"`,
    );
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_accessories_packaging"`,
    );
  }
}
