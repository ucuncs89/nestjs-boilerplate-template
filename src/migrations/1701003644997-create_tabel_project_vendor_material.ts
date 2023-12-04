import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTabelProjectVendorMaterial1701003644997
  implements MigrationInterface
{
  name = 'CreateTabelProjectVendorMaterial1701003644997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "project_material_item_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_aae34fca8c8dbead678318750ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_detail" ("id" SERIAL NOT NULL, "project_vendor_material_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" double precision, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_b7a61b091e1a553055f65ebd278" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_vendor_material_detail"`);
    await queryRunner.query(`DROP TABLE "project_vendor_material"`);
  }
}
