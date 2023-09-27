import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPlanningAccessoriesPackaging1695780006172
  implements MigrationInterface
{
  name = 'CreateTableProjectPlanningAccessoriesPackaging1695780006172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_planning_accessories_packaging" ("id" SERIAL NOT NULL, "project_planning_id" integer NOT NULL, "accessories_packaging_id" integer NOT NULL, "name" character varying NOT NULL, "category" character varying, "consumption" double precision, "consumption_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_d66b28b333fe4a9396fb324a068" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "project_planning_accessories_packaging"`,
    );
  }
}
