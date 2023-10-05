import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorProduction1696497309434
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorProduction1696497309434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_production" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "sewing_percentage_of_loss" double precision, "cutting_percentage_of_loss" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_1a65b40b44b9d21f3bf5ac1e671" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_production_detail" ("id" SERIAL NOT NULL, "project_vendor_production_id" integer NOT NULL, "vendor_id" integer NOT NULL, "vendor_name" character varying NOT NULL, "activity_id" integer NOT NULL, "activity_name" character varying NOT NULL, "quantity" integer, "quantity_unit" character varying, "price" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_02324ecd6d23bd2cf87e9b368c4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_vendor_production_detail"`);
    await queryRunner.query(`DROP TABLE "project_vendor_production"`);
  }
}
