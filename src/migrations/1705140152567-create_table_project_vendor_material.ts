import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterial1705140152567
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterial1705140152567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "project_material_item_id" integer NOT NULL, "section_type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_aae34fca8c8dbead678318750ad" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_vendor_material"`);
  }
}
