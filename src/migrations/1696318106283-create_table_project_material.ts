import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectMaterial1696318106283
  implements MigrationInterface
{
  name = 'CreateTableProjectMaterial1696318106283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_material" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "material_source" character varying(50) NOT NULL, "total_price" double precision, "fabric_percentage_of_loss" double precision, "sewing_accessories_percentage_of_loss" double precision, "packaging_accessories_percentage_of_loss" double precision, "packaging_instructions" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_cd27cf50d9f5695455bfc6bcf95" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_material"`);
  }
}
