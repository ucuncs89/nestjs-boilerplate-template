import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPlanning1695624855891
  implements MigrationInterface
{
  name = 'CreateTableProjectPlanning1695624855891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_planning" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "status" character varying NOT NULL, "material_source" character varying(50) NOT NULL, "total_price" double precision, "fabric_percentage_of_loss" double precision, "sewing_accessories_percentage_of_loss" double precision, "packaging_accessories_percentage_of_loss" double precision, "packaging_instructions" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ae3787710e564d0d0b420b3a59a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_planning"`);
  }
}
