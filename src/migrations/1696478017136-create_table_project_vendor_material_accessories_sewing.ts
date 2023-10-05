import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterialAccessoriesSewing1696478017136
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterialAccessoriesSewing1696478017136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_accessories_sewing" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "project_accessories_sewing_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_131e8ab1658c5441156e4ee6935" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_accessories_sewing_detail" ("id" SERIAL NOT NULL, "project_vendor_material_accessories_sewing_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" integer, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f506aecbb801884a81123f69546" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_accessories_sewing_detail"`,
    );
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_accessories_sewing"`,
    );
  }
}
