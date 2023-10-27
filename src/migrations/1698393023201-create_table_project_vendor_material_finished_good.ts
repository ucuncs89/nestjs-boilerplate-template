import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterialFinishedGood1698393023201
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterialFinishedGood1698393023201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_finished_good" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "project_fabric_id" integer, CONSTRAINT "PK_81e093de96503500a88c01dc381" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_finished_good_detail" ("id" SERIAL NOT NULL, "project_vendor_material_finished_good_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" double precision, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "project_vendor_material_fabric_id" integer, CONSTRAINT "PK_38d4c7c4d89aa27f5dff4b134cd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_finished_good_detail"`,
    );
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_finished_good"`,
    );
  }
}
