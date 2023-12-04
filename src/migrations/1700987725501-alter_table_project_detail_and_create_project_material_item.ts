import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectDetailAndCreateProjectMaterialItem1700987725501
  implements MigrationInterface
{
  name = 'AlterTableProjectDetailAndCreateProjectMaterialItem1700987725501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_material_item" ("id" SERIAL NOT NULL, "project_material_id" integer NOT NULL, "relation_id" integer NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "category" character varying, "used_for" character varying, "cut_shape" character varying, "consumption" double precision, "consumption_unit" character varying, "heavy" double precision, "heavy_unit" character varying, "long" double precision, "long_unit" character varying, "wide" double precision, "wide_unit" character varying, "diameter" double precision, "diameter_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_472930e6c8dd14f10a4efe55738" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "material_source" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "total_price" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "fabric_percentage_of_loss" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "sewing_accessories_percentage_of_loss" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "packaging_accessories_percentage_of_loss" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "finished_goods_percentage_of_loss" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "packaging_instructions" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "packaging_instructions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "finished_goods_percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "packaging_accessories_percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "sewing_accessories_percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "fabric_percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "total_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "material_source"`,
    );

    await queryRunner.query(`DROP TABLE "project_material_item"`);
  }
}
