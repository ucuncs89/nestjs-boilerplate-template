import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterialDetail1705143384736
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterialDetail1705143384736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_detail" ("id" SERIAL NOT NULL, "project_vendor_material_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" double precision, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_b7a61b091e1a553055f65ebd278" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_vendor_material_detail"`);
  }
}
